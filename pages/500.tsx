import ErrorPage from '../components/ErrorPage';

export default function Custom500() {
    return (
        <ErrorPage
            title="خطای سیستمی"
            message="متاسفانه در دریافت اطلاعات خودرو مشکلی پیش آمده است. لطفاً دوباره تلاش کنید"
            code="500"
        />
    );
}