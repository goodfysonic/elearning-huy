import React from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { useNavigate } from 'react-router-dom';
import { Button, Tag } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import routes from '@routes';
import { FieldTypes } from '@constants/formConfig';
import moment from 'moment';
import { commonMessage } from '@locales/intl';
import { statusOptions } from '@constants/masterData';
import { DATE_FORMAT_VALUE, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants/index';

const message = defineMessages({
    objectName: 'Môn học',
});

const SubjectListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, loading, pagination, queryFilter } = useListBase({
        apiConfig: apiConfig.subject,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
           
        },
    });

    const columns = [
        {
            title: <FormattedMessage defaultMessage="Tên môn học" />,
            dataIndex: 'subjectName',
        },
        {
            title: <FormattedMessage defaultMessage="Mã môn học" />,
            dataIndex: 'subjectCode',
        },
        {
            title: <FormattedMessage defaultMessage="Ngày tạo" />,
            dataIndex: 'createdDate',
            render: (createdDate) => {
                const date = moment(createdDate, "DD/MM/YYYY HH:mm:ss", true);
                if (!date.isValid()) {
                    return "Invalid date";
                }
                return date.format("DD/MM/YYYY HH:mm:ss");
            },
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'subjectName',
            placeholder: translate.formatMessage(commonMessage.subjectName),
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
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.subjectName) }]}>
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

export default SubjectListPage;
