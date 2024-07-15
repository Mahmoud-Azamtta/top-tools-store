import * as Yup from 'yup';

const reviewValidationSchema = Yup.object().shape({
    comment: Yup.string()
        .min(3, 'يجب أن يكون التعليق على الأقل 3 أحرف')
        .max(20, 'لا يمكن أن يزيد التعليق عن 20 حرفًا')
        .required('التعليق مطلوب'),
    rating: Yup.number()
        .min(1, 'يجب أن يكون التقييم على الأقل 1')
        .max(5, 'لا يمكن أن يزيد التقييم عن 5')
        .required('التقييم مطلوب')
        .typeError('يجب أن تكون التقييم رقماً'),
});

export default reviewValidationSchema;
