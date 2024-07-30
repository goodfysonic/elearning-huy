import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';
import routes from './routes';
import CategoryForm from './CategoryForm';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import { categoryKinds } from '@constants';

const messages = defineMessages({
    objectName: 'loại',
    category: 'Vai trò dự án',
});

const CategorySavePage = () => {
    const categoryId = useParams();
    const translate = useTranslate();

    const queryParameters = new URLSearchParams(window.location.search);
    // const parentId = queryParameters.get("parentId");
    const kindOfRole = categoryKinds.CATEGORY_KIND_ROLE;

    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.category.getById,
            create: apiConfig.category.create,
            update: apiConfig.category.update,
        },
        options: {
            getListUrl: generatePath(routes.categoryListPageRole.path, { categoryId }),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    categoryKind: kindOfRole,
                    categoryOrdering: 0,
                };
            };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(messages.category),
                    path: generatePath(routes.categoryListPageRole.path, { categoryId }),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CategoryForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
};
export default CategorySavePage;
