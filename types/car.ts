export interface CarDetails {
    manufacturer: string;
    model: string;
    price: string;
    year: string;
    color: string;
    fuelType: string;
    mileage: string;
    engineCondition: string;
    chassisCondition: string;
    bodyCondition: string;
    insuranceValidity: string;
    gearbox: string;
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
