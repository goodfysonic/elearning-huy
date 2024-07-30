import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { formatMoney } from '@utils';
import { Button } from 'antd';
import { UserOutlined, ReadOutlined } from '@ant-design/icons';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { FieldTypes } from '@constants/formConfig';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import { lectureState } from '@constants/masterData';
import useMoneyUnit from '@hooks/useMoneyUnit';
import { Tag } from 'antd';
import dayjs from 'dayjs'; 

const messages = defineMessages({
    objectName: 'Khóa học',
});

const CourseListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(lectureState, ['label']);

    const { data, mixinFuncs, loading, pagination, queryFilter, serializeParams } = useListBase({
        apiConfig: apiConfig.course,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
                return { data: [], total: 0 };
            };
            funcs.changeFilter = (filter) => {
                mixinFuncs.setQueryParams(serializeParams(filter));
            };
        },
    });

    const moneyUnit = useMoneyUnit();
    
    const columns = [
        {
            title: '#',
            dataIndex: 'banner',
            align: 'center',
            width: 80,
            render: (banner) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={banner ? `${AppConstants.contentRootUrl}${banner}` : null}
                />
            ),
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'name',
            width: 180,
        },
        {
            title: 'Tên môn học',
            dataIndex: ['subject', 'name'],
            width: 150,
            render: (_, record) => record.subject?.name,
        },
        {
            title: 'Học phí',
            dataIndex: 'fee',
            align: 'right',
            width: 170,
            render: (fee) => {
                const formattedValue = formatMoney(fee, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: 'đ',
                    currentDecimal: '2',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: 'Leader',
            dataIndex: ['leader', 'account', 'fullName'],
            width: 150,
            render: (_, record) => record.leader?.account?.fullName,
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'dateRegister',
            width: 150,
            render: (dateRegister) => dayjs(dateRegister, 'DD/MM/YYYY HH:mm:ss').isValid() ? dayjs(dateRegister, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY') : 'Invalid Date',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'dateEnd',
            width: 150,
            render: (dateEnd) => dayjs(dateEnd, 'DD/MM/YYYY HH:mm:ss').isValid() ? dayjs(dateEnd, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY') : 'Invalid Date',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'state',
            width: 150,
            render: (state) => {
                const currentState = lectureState.find(item => item.value === state);
                if (!currentState) return state;
                const { label, color } = currentState;
                return (
                    <Tag color={color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>
                            {translate.formatMessage(label)}
                        </div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: 200 },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.courseName),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
            submitOnChanged: true,
        },
    ];

    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.course) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            />
        </PageWrapper>
    );
};

export default CourseListPage;
