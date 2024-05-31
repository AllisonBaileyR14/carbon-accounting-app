export interface EmissionDetail {
    Activity: number | null;
    ActivityUnits: string | null;
    Capacity: number | null;
    CapacityFactor: number | null;
    CapacityUnits: string | null;
    EmissionsFactor: number | null;
    EmissionsFactorUnits: string | null;
    co2?: number;
    ch4?: number;
    n2o?: number;
    co2e_20yr?: number;
    co2e_100yr?: number;
}

export interface Emission {
    [year: string]: EmissionDetail[];
}

export interface Owner {
    CompanyName: string;
    EndDate: string;
    OwnerCountry: string;
    OwnerRelationship: string;
    PercentInterestParent: number | null;
    PercentageOfInterestCompany: number;
    StartDate: string;
    UltimateParentId: number;
    UltimateParentName: string;
}

export interface ConfidenceDetail {
    activity: string;
    asset_type: string;
    capacity: string | null;
    capacity_factor: string | null;
    ch4_emissions: string;
    ch4_emissions_factor: string;
    co2_emissions: string;
    co2_emissions_factor: string;
    n2o_emissions: string | null;
    n2o_emissions_factor: string | null;
    other_gas_emissions: string;
    other_gas_emissions_factor: string;
    total_co2e_100yrgwp: string;
    total_co2e_20yrgwp: string;
}

export interface Confidence {
    [year: string]: ConfidenceDetail[];
}

export interface Asset {
    Id: number;
    Name: string;
    NativeId: string;
    Country: string;
    Sector: string;
    Subsectors: string;
    AssetType: string;
    ReportingEntity: string;
    Emissions: Emission[];
    Owners: Owner[];
    Confidence: Confidence[];
    Centroid: {
        Geometry: [number, number];
        SRID: number;
    };
    Thumbnail: string;
}

export interface AssetResponse {
    bbox: number[];
    assets: Asset[];
}
