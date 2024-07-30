import { UserOutlined, BookOutlined } from '@ant-design/icons';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import routes from '@routes';
import apiConfig from './apiConfig';

const navMenuConfig = [
    {
        label: <FormattedMessage defaultMessage="Quản lý admin" />,
        key: 'account-management',
        icon: <UserOutlined size={16} />,
        children: [],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý Khoá học" />,
        key: 'course-management',
        icon: <BookOutlined size={16} />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Quản lý sinh viên" />,
                key: 'student-management',
                path: routes.studentListPage.path,
                permission: apiConfig.student.getList.baseURL,
            },
                
            {
                label: <FormattedMessage defaultMessage="Quản lý môn học" />,
                key: 'subject-manangemennt',
                path: routes.subjectListPage.path,
                permission: apiConfig.subject.getList.baseURL,
            },

            {
                label: <FormattedMessage defaultMessage="Quản lý khóa học" />,
                key: 'course-manangemennt',
                path: routes.courseListPage.path,
                permission: apiConfig.course.getList.baseURL,
            },
        ],
    },
    
    {
        label: <FormattedMessage defaultMessage="Quản lý dự án" />,
        key: 'project-management',
        icon: <BookOutlined size={16} />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Quản lý lập trình viên" />,
                key: 'developer-management',
                path: routes.developerListPage.path,  
                permission: apiConfig.developer.getList.baseURL,
            },
        ],
    },
];

export default navMenuConfig;