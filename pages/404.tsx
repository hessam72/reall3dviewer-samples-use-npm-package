import ErrorPage from '../components/ErrorPage';

export default function Custom404() {
    return (
        <ErrorPage
            title="صفحه مورد نظر یافت نشد"
            message="متاسفانه خودروی مورد نظر شما در سیستم موجود نیست"
            code="404"
        />
    );
}