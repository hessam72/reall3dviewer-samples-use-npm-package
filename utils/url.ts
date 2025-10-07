export const getFullFileUrl = (path: string | undefined) => {
    if (!path) return '';
    return `${process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL}${path}`;
};
