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

    const handleSubmit = (values) => {
        const errors = [];
        // Hiển thị lỗi nếu có
        if (errors.length > 0) {
            errors.forEach(error => alert(error));
            return;
        }
        
        // Chuẩn bị dữ liệu để gửi
        const formattedStartDate = values.startDate ? formatDateString(values.startDate, DATE_FORMAT_VALUE) + ' 00:00:00' : "";
        const formattedEndDate = values.endDate ? formatDateString(values.endDate, DATE_FORMAT_VALUE) + ' 00:00:00' : "";
        
        const payload = {
            ...values,
            tuitionfee,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            avatarPath: imageUrl,
            bannerPath: bannerUrl,
        };
    
        console.log("Payload to be sent:", payload);
        
        // Gọi API để lưu dữ liệu
        return mixinFuncs.handleSubmit(payload);
    };
    
    const validateStartDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isBefore(date)) {
            return Promise.reject('Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại');
        }
        return Promise.resolve();
    };

    const validateDueDate = (_, value) => {
        const { startDate } = form.getFieldValue();
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };

    useEffect(() => {
        if (dataDetail) {
            dataDetail.startDate = dataDetail?.startDate && dayjs(dataDetail?.startDate, DATE_FORMAT_VALUE);
            dataDetail.endDate = dataDetail?.endDate && dayjs(dataDetail?.endDate, DATE_FORMAT_VALUE);
            form.setFieldsValue({
                ...dataDetail,
                courseName: dataDetail?.courseName,
                subject: dataDetail?.subject,
                leaderId: dataDetail?.leader?.accountDto?.id,
                tuitionfee: dataDetail?.tuitionfee,
                refundFee: dataDetail?.refundFee,
                description: dataDetail?.description,
            });
            setImageUrl(dataDetail.accountDto?.avatar);
            setBannerUrl(dataDetail.bannerPath);
        } else {
            form.resetFields();
        }
    }, [dataDetail]);

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
                                name="avatarPath"
                                imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                                aspect={1 / 1}
                                required
                                uploadFile={uploadFile}
                            />
                        </Col>
                        <Col span={12}>
                            <CropImageField
                                label={translate.formatMessage(messages.banner)}
                                name="bannerPath"
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
                                name="courseName"
                                required={true}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.subjectName)}
                                name="subjectName"
                                required={true}
                                rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
                            />
                        </Col>
                        <Col span={12}>
                            <DatePickerField
                                name="startDate"
                                label="Ngày bắt đầu"
                                placeholder="Ngày bắt đầu"
                                format={DATE_FORMAT_VALUE}
                                style={{ width: '100%' }}
                                required={true}
                                rules={[
                                    {
                                        validator: validateStartDate,
                                    },
                                ]}
                            />
                        </Col>
                        <Col span={12}>
                            <DatePickerField
                                name="endDate"
                                label="Ngày kết thúc"
                                placeholder="Ngày kết thúc"
                                format={DATE_FORMAT_VALUE}
                                style={{ width: '100%' }}
                                required={true}
                                rules={[
                                    {
                                        validator: validateDueDate,
                                    },
                                ]}
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
                            <NumericField
                                label={translate.formatMessage(commonMessage.tuitionfee)}
                                name="tuitionfee"
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
