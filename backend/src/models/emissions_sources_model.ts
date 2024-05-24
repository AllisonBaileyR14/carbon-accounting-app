export interface Emission {
    Activity: any;
    ActivityUnits: string;
    Capacity: any;
    CapacityFactor: any;
    CapacityUnits: string;
    EmissionsFactor: number | null;
    EmissionsFactorUnits: string;
    n2o?: number | null;
    co2?: number | null;
    ch4?: number | null;
    co2e_20yr?: number | null;
    co2e_100yr?: number | null;
}

export interface EmissionYear {
    [year: string]: Emission[];
}

export interface Owner {
    CompanyName: string;
    EndDate: string;
    OwnerCountry: string;
    OwnerRelationship: string;
    PercentInterestParent: any;
    PercentageOfInterestCompany: number;
    StartDate: string;
    UltimateParentId: number;
    UltimateParentName: string;
}

export interface ConfidenceYear {
    [year: string]: Confidence[];
}

export interface Confidence {
    activity: string;
    asset_type: string;
    capacity: any;
    capacity_factor: any;
    ch4_emissions: string;
    ch4_emissions_factor: string;
    co2_emissions: string;
    co2_emissions_factor: string;
    n2o_emissions: any;
    n2o_emissions_factor: any;
    other_gas_emissions: string;
    other_gas_emissions_factor: string;
    total_co2e_100yrgwp: string;
    total_co2e_20yrgwp: string;
}

export interface Centroid {
    Geometry: number[];
    SRID: number;
}

export interface Asset {
    Id: number;
    Name: string;
    NativeId: string;
    Country: string;
    Sector: string;
    AssetType: string;
    ReportingEntity: string;
    Emissions: EmissionYear[];
    Owners: Owner[];
    Confidence: ConfidenceYear[];
    Centroid: Centroid;
    Thumbnail: string;
}

export interface AssetResponse {
    bbox: number[];
    assets: Asset[];
}

export interface AssetQueryParams {
    limit?: number;
    year?: number;
    offset?: number;
    countries?: string;
    sectors?: string;
    subsectors?: string;
    continents?: string;
    groups?: string;
    adminId?: number;
}
