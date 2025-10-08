export interface CarDetails {
    color: string;
    build_year: string;
    model: string;
    document_status: string;
    three_d_status: string;
    status: string;
    mileage: string;
    price: string;
    description: string;
}

export interface CarBodyStat {
    bodyPart: string;
    status: string;
}

export interface CarData {
    carDetails: CarDetails;
    bodyStats: CarBodyStat[];
    fileUrl: string;
}
