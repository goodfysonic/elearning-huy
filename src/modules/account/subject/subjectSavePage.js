import React from 'react';
import { useParams, generatePath } from 'react-router-dom';  
import PageWrapper from '@components/common/layout/PageWrapper';
import SubjectForm from './subjectForm'; 
import useSaveBase from '@hooks/useSaveBase';
import apiConfig from '@constants/apiConfig';
import routes from './routes';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    objectName:'Môn học',
    subject: 'Môn học', 
});

const SubjectSavePage = () => {
    const subjectId  = useParams();
    const translate = useTranslate();

    const { detail, onSave, mixinFuncs,setIsChangedFormValues,isEditing,errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.subject.getById,
            create: apiConfig.subject.create,
            update: apiConfig.subject.update,
        },
        options: {
            getListUrl: routes.subjectListPage.path,
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
                };
            };
        },        
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(messages.subject),
                    path: generatePath(routes.subjectListPage.path, { subjectId } ) },  
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <SubjectForm
                formId={mixinFuncs.getFormId()}
                actions={mixinFuncs.renderActions()}
                dataDetail = {detail ? detail : {}}  
                onSubmit={onSave}
                setIsChangedFormValues={setIsChangedFormValues}
                isError={errors}
                isEditing={isEditing}
            />
        </PageWrapper>
    );
};

export default SubjectSavePage;
