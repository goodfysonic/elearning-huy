import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Form } from 'antd';
import useFetch from '@hooks/useFetch';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import TextField from '@components/common/form/TextField';
import NumericField from '@components/common/form/NumericField';
import DatePickerField from '@components/common/form/DatePickerField';
import CropImageField from '@components/common/form/CropImageField';
import SelectField from '@components/common/form/SelectField';
import apiConfig from '@constants/apiConfig';
import { statusOptions, lectureState } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { FormattedMessage, defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';
import { AppConstants, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants';
import dayjs from 'dayjs';
import { formatDateString } from '@utils';

const messages = defineMessages({
    objectName: 'Khóa học',
    avatarPath: 'Avatar',
    banner: 'Banner',
});

const CourseForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing } = props;
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(lectureState, ['label']);
    const { form, mixinFuncs, onValuesChange, setFieldValue } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const [bannerUrl, setBannerUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (dataDetail) {
            form.setFieldsValue({
                ...dataDetail,
                dateRegister: dataDetail.dateRegister && dayjs(dataDetail.dateRegister, DATE_FORMAT_VALUE),
                dateEnd: dataDetail.dateEnd && dayjs(dataDetail.dateEnd, DATE_FORMAT_VALUE),
                leaderId: { value: dataDetail.leaderId, label: dataDetail.leaderName },  // Thiết lập giá trị cho leaderId
            });
            setImageUrl(dataDetail.avatar);
            setBannerUrl(dataDetail.banner);
        }
    }, [dataDetail]);

    const handleSubmit = (values) => {
        const formattedDateRegister = values.dateRegister
            ? formatDateString(values.dateRegister, DATE_FORMAT_VALUE) + ' 00:00:00'
            : '';
        const formattedDateEnd = values.dateEnd
            ? formatDateString(values.dateEnd, DATE_FORMAT_VALUE) + ' 00:00:00'
            : '';

        const payload = {
            ...values,
            id: dataDetail?.courseId,
            dateRegister: formattedDateRegister,
            dateEnd: formattedDateEnd,
            avatar: imageUrl,
            banner: bannerUrl,
            leaderId: values.leaderId?.value || dataDetail?.leaderId,
        };

        mixinFuncs.handleSubmit(payload)
            .then(response => {
                console.log(isEditing ? 'Update successful' : 'Create successful', response);
            })
            .catch(error => {
                console.error('Error while saving', error);
            });
    };

    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    const uploadBannerFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setBannerUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onFieldsChange={onValuesChange} size="1100px">
            <Card className="card-form" bordered={false}>
                <div style={{ width: '980px' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <CropImageField
                                label={translate.formatMessage(messages.avatarPath)}
                                name="avatar"
                                imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                                aspect={1 / 1}
                                required
                                uploadFile={uploadFile}
                            />
                        </Col>
                        <Col span={12}>
                            <CropImageField
                                label={translate.formatMessage(messages.banner)}
                                name="banner"
                                imageUrl={bannerUrl && `${AppConstants.contentRootUrl}${bannerUrl}`}
                                aspect={16 / 9}
                                uploadFile={uploadBannerFile}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.courseName)}
                                name="name"
                                required={true}
                            />
                        </Col>
                        <Col span={12}>
                            <AutoCompleteField
                                label={translate.formatMessage(commonMessage.subjectName)}
                                name="subjectId"
                                apiConfig={apiConfig.subject.autocomplete}
                                mappingOptions={(item) => ({ value: item.id, label: item.name })}
                                searchParams={(text) => ({ name: text })}
                                required={!isEditing}
                            />
                        </Col>
                        <Col span={12}>
                            <DatePickerField
                                name="dateRegister"
                                label="Ngày đăng ký"
                                placeholder="Ngày đăng ký"
                                format={DATE_FORMAT_VALUE}
                                style={{ width: '100%' }}
                                required={true}
                            />
                        </Col>
                        <Col span={12}>
                            <DatePickerField
                                name="dateEnd"
                                label="Ngày kết thúc"
                                placeholder="Ngày kết thúc"
                                format={DATE_FORMAT_VALUE}
                                style={{ width: '100%' }}
                                required={true}
                            />
                        </Col>
                        <Col span={24}>
                            <TextField
                                label={translate.formatMessage(commonMessage.description)}
                                required={true}
                                name="description"
                            />
                        </Col>
                        <Col span={12}>
                            <AutoCompleteField
                                label={<FormattedMessage defaultMessage="Leader" />}
                                name="leaderId"
                                apiConfig={apiConfig.developer.autocomplete}
                                mappingOptions={(item) => ({ value: item.id, label: item.account.fullName })}
                                searchParams={(text) => ({ name: text })}
                                required={true}
                            />
                        </Col>
                        <Col span={12}>
                            <NumericField
                                label={translate.formatMessage(commonMessage.tuitionfee)}
                                name="fee"
                                min={0}
                                max={100000000000000}
                                rules={[{ required: true, message: 'Học phí không được để trống' }]}
                                addonAfter="$"
                            />
                        </Col>
                        <Col span={12}>
                            <NumericField
                                label={translate.formatMessage(commonMessage.returnFee)}
                                name="returnFee"
                                min={0}
                                max={100000000000000}
                                addonAfter="$"
                            />
                        </Col>
                        <Col span={12}>
                            <SelectField
                                required
                                label={<FormattedMessage defaultMessage="Trạng thái" />}
                                name="status"
                                options={statusValues}
                            />
                        </Col>
                        <Col span={12}>
                            <SelectField
                                required
                                label={<FormattedMessage defaultMessage="Tình trạng" />}
                                name="state"
                                options={stateValues}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                label="Tag"
                                name="tag"
                            />
                        </Col>
                    </Row>
                </div>
                <div className="footer-card-form" style={{ marginTop: '20px', marginRight: '69px' }}>
                    {actions}
                </div>
            </Card>
        </BaseForm>
    );
};

export default CourseForm;
