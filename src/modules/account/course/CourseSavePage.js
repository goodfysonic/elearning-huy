import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { generatePath, useNavigate, useParams } from 'react-router-dom'; // Thêm useParams
import routes from './routes';
import apiConfig from '@constants/apiConfig';
import CourseForm from './CourseForm';
import { showErrorMessage } from '@services/notifyService';
import { commonMessage } from '@locales/intl';
import useFetch from '@hooks/useFetch';
import useSaveBase from '@hooks/useSaveBase';
import PageWrapper from '@components/common/layout/PageWrapper';
import { commonStatus } from '@constants';

 
const messages = defineMessages({
    objectName: 'Khóa học',
});

const CourseSavePage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { id: courseId } = useParams(); // Lấy courseId từ URL
    const [courseData, setCourseData] = useState(null);
    const isEditing = Boolean(courseId); // Xác định là edit hay là create
    const {
        detail,
        mixinFuncs,
        loading,
        setIsChangedFormValues,
        title,
    } = useSaveBase({
        apiConfig: {
            getById: apiConfig.course.getById,
            create: apiConfig.course.create,
            update: apiConfig.course.update,
        },
        options: {
            getListUrl: generatePath(routes.courseListPage.path, {}),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => ({
                ...data,
                courseId: detail.id,
                status: commonStatus.ACTIVE,
            });

            funcs.prepareCreateData = (data) => ({
                ...data,
                status: commonStatus.ACTIVE,
            });

            funcs.onSaveError = (err) => {
                console.error("Save Error:", err.response?.data || err.message || err);
                const message = err.response?.data?.message || 'An error occurred';
                showErrorMessage(message);
                mixinFuncs.setSubmit(false);
            };
        },
    });

    useEffect(() => {
        if (courseId) {
            fetch(`/api/courses/${courseId}`)
                .then(response => response.json())
                .then(data => setCourseData(data))
                .catch(error => console.error('Error fetching course data:', error));
        }
    }, [courseId]);

    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.course),
                    path: generatePath(routes.courseListPage.path, {}),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CourseForm
                courseId={courseId} // Truyền courseId vào Form
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail || {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
};

export default CourseSavePage;
