import apiConfig from '@constants/apiConfig';
import CourseSavePage from './CourseSavePage';
import courseListPage from '.';

export default {
    courseListPage: {
        path: '/course',
        title: 'Course',
        auth: true,
        component: courseListPage,
        permissions: [apiConfig.course.getList.baseURL],
    },
    CourseSavePage: {
        path: '/course/:id',
        title: 'Course Save Page',
        auth: true,
        component: CourseSavePage,
        permissions: [apiConfig.course.create.baseURL, apiConfig.course.update.baseURL],
    },
};
