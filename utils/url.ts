export const getFullFileUrl = (path: string | undefined) => {
    if (!path) return '';
    console.log('********* the path: ', path);
    return `${process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL}${path}`;
};
