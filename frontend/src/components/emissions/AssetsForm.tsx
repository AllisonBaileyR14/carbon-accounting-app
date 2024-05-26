import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { fetchAssets } from '../../services/emissions/api';
import { Asset, Emission, EmissionDetail } from '../../types/emissions/types';
import BarChart from './BarChart';
import PieChart from './PieChart';
import AssetsTable from './AssetsTable';
import country from 'country-list-js';

const sectorsOptions = [
    { value: 'power', label: 'Power' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'fossil-fuel-operations', label: 'Fossil Fuel Operations' },
    { value: 'mineral-extraction', label: 'Mineral Extraction' },
    { value: 'forestry-and-land-use', label: 'Forestry and Land Use' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'waste', label: 'Waste' },
];

interface SubSectorOption {
    value: string;
    label: string;
}

type SubSectorsOptionsType = {
    [key: string]: SubSectorOption[];
};

const subSectorsOptions: SubSectorsOptionsType = {
    power: [{ value: 'electricity-generation', label: 'Electricity Generation' }],
    manufacturing: [
        { value: 'steel', label: 'Steel' },
        { value: 'cement', label: 'Cement' },
        { value: 'aluminum', label: 'Aluminum' },
        { value: 'pulp-and-paper', label: 'Pulp and Paper' },
        { value: 'chemicals', label: 'Chemicals' },
        { value: 'petrochemicals', label: 'Petrochemicals' },
        { value: 'other-manufacturing', label: 'Other Manufacturing' },
    ],
    transportation: [
        { value: 'domestic-shipping-ship', label: 'Domestic Shipping (Ship)' },
        { value: 'international-shipping-ship', label: 'International Shipping (Ship)' },
        { value: 'domestic-shipping', label: 'Domestic Shipping (Port)' },
        { value: 'international-shipping', label: 'International Shipping (Port)' },
        { value: 'domestic-aviation', label: 'Domestic Aviation (Airport)' },
        { value: 'international-aviation', label: 'International Aviation (Airport)' },
        { value: 'road-transportation', label: 'Road Transportation (Urban Area)' },
        { value: 'road-transportation-road-segment', label: 'Road Transportation (Road Segment)' },
    ],
    'fossil-fuel-operations': [
        { value: 'oil-and-gas-production-and-transport', label: 'Oil and Gas Production and Transport (Field)' },
        { value: 'oil-and-gas-production-and-transport-sub-field', label: 'Oil and Gas Production and Transport (Sub-field)' },
        { value: 'oil-and-gas-refining', label: 'Oil and Gas Refining (Refinery)' },
        { value: 'coal-mining', label: 'Coal Mining (Coal Mine)' },
    ],
    'mineral-extraction': [
        { value: 'bauxite-mining', label: 'Bauxite Mining' },
        { value: 'iron-mining', label: 'Iron Mining' },
        { value: 'copper-mining', label: 'Copper Mining' },
    ],
    'forestry-and-land-use': [
        { value: 'forest-land-clearing', label: 'Forest Land Clearing' },
        { value: 'forest-land-degradation', label: 'Forest Land Degradation' },
        { value: 'forest-land-fires', label: 'Forest Land Fires' },
        { value: 'shrubgrass-fires', label: 'Shrubgrass Fires' },
        { value: 'wetland-fires', label: 'Wetland Fires' },
        { value: 'removals', label: 'Removals' },
        { value: 'net-forest-land', label: 'Net Forest Land' },
        { value: 'net-wetland', label: 'Net Wetland' },
        { value: 'net-shrubgrass', label: 'Net Shrubgrass' },
    ],
    agriculture: [
        { value: 'cropland-fires', label: 'Cropland Fires' },
        { value: 'rice-cultivation', label: 'Rice Cultivation' },
        { value: 'enteric-fermentation-cattle-feedlot', label: 'Enteric Fermentation (Cattle Feedlot)' },
        { value: 'manure-management-cattle-feedlot', label: 'Manure Management (Cattle Feedlot)' },
        { value: 'synthetic-fertilizer-application', label: 'Synthetic Fertilizer Application' },
        { value: 'enteric-fermentation-cattle-pasture', label: 'Enteric Fermentation (Cattle Pasture)' },
        { value: 'manure-left-on-pasture-cattle', label: 'Manure Left on Pasture (Cattle)' },
    ],
    waste: [
        { value: 'solid-waste-disposal', label: 'Solid Waste Disposal' },
        { value: 'wastewater-treatment-and-discharge', label: 'Wastewater Treatment and Discharge' },
    ],
};

const countryOptions = country.names().map(name => {
    const countryInfo = country.findByName(name);
    return {
        value: countryInfo.code.iso3,
        label: name
    };
}).filter(option => option.value);

const AssetsForm = () => {
    const [formData, setFormData] = useState({
        limit: 100,
        year: 2022,
        offset: 0,
        countries: [] as { value: string; label: string }[],
        sectors: '',
        subsectors: '',
        continents: '',
        groups: '',
        adminId: 1,
    });

    const [data, setData] = useState<Asset[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<{ country: string; co2: number }[]>([]);
    const [pieChartData, setPieChartData] = useState<{ sector: string; co2: number }[]>([]);
    const [chartTitle, setChartTitle] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSectorChange = (selectedOption: any) => {
        setFormData({
            ...formData,
            sectors: selectedOption ? selectedOption.value : '',
        });
    };

    const handleCountriesChange = (selectedOptions: any) => {
        setFormData({
            ...formData,
            countries: selectedOptions ? selectedOptions : [],
        });
    };

    const handleSubSectorChange = (selectedOption: any) => {
        setFormData({
            ...formData,
            subsectors: selectedOption ? selectedOption.value : '',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const queryData = {
                ...formData,
                countries: formData.countries.map(country => country.value).join(','), // Convert to comma-separated ISO3 codes
            };
            const assets = await fetchAssets(queryData);
            setData(assets);
            setError(null);
            setChartTitle(`Countries: ${formData.countries.map(c => c.label).join(', ')}, Year: ${queryData.year}, Sector: ${queryData.sectors}, Emissions: CO2`);
        } catch (error: any) {
            console.error('Error fetching assets:', error);
            setError(error.message);
            setData([]);
        }
    };

    useEffect(() => {
        const aggregateCO2ByCountry = () => {
            const countryCO2Map: { [key: string]: number } = {};

            data.forEach((asset) => {
                const country = asset.Country;
                asset.Emissions.forEach((emission: Emission) => {
                    Object.values(emission).forEach((details: EmissionDetail[]) => {
                        details.forEach((detail: EmissionDetail) => {
                            if (detail.co2 !== null && detail.co2 !== undefined) {
                                if (!countryCO2Map[country]) {
                                    countryCO2Map[country] = 0;
                                }

                                countryCO2Map[country] += detail.co2;
                            }
                        });
                    });
                });
            });

            const chartDataArray = Object.entries(countryCO2Map).map(([country, co2]) => ({
                country,
                co2,
            }));

            setChartData(chartDataArray);
        };
        const aggregateCO2BySector = () => {
            const sectorCO2Map: { [key: string]: number } = {};

            data.forEach((asset) => {
                const sector = asset.Sector;
                asset.Emissions.forEach((emission: Emission) => {
                    Object.values(emission).forEach((details: EmissionDetail[]) => {
                        details.forEach((detail: EmissionDetail) => {
                            if (detail.co2 !== null && detail.co2 !== undefined) {
                                if (!sectorCO2Map[sector]) {
                                    sectorCO2Map[sector] = 0;
                                }

                                sectorCO2Map[sector] += detail.co2;
                            }
                        });
                    });
                });
            });

            const pieChartDataArray = Object.entries(sectorCO2Map).map(([sector, co2]) => ({
                sector,
                co2,
            }));

            setPieChartData(pieChartDataArray);
        };

        aggregateCO2ByCountry();
        aggregateCO2BySector();
    }, [data]);

    const prepareCSVData = () => {
        const csvData: any[] = [];
        data.forEach((asset) => {
            asset.Emissions.forEach((emission: Emission) => {
                Object.entries(emission).forEach(([year, details]) => {
                    (details as EmissionDetail[]).forEach((detail: EmissionDetail) => {
                        csvData.push({
                            ID: asset.Id,
                            Name: asset.Name,
                            Country: asset.Country,
                            Sector: asset.Sector,
                            AssetType: asset.AssetType,
                            ReportingEntity: asset.ReportingEntity,
                            Year: year,
                            Activity: detail.Activity !== null ? detail.Activity : 'N/A',
                            ActivityUnits: detail.ActivityUnits !== null ? detail.ActivityUnits : 'N/A',
                            Capacity: detail.Capacity !== null ? detail.Capacity : 'N/A',
                            CapacityFactor: detail.CapacityFactor !== null ? detail.CapacityFactor : 'N/A',
                            CapacityUnits: detail.CapacityUnits !== null ? detail.CapacityUnits : 'N/A',
                            EmissionsFactor: detail.EmissionsFactor !== null ? detail.EmissionsFactor : 'N/A',
                            EmissionsFactorUnits: detail.EmissionsFactorUnits !== null ? detail.EmissionsFactorUnits : 'N/A',
                            CO2: detail.co2 !== null ? detail.co2 : 'N/A',
                            CH4: detail.ch4 !== null ? detail.ch4 : 'N/A',
                            N2O: detail.n2o !== null ? detail.n2o : 'N/A',
                            CO2e_20yr: detail.co2e_20yr !== null ? detail.co2e_20yr : 'N/A',
                            CO2e_100yr: detail.co2e_100yr !== null ? detail.co2e_100yr : 'N/A',
                        });
                    });
                });
            });
        });
        return csvData;
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Limit:
                        <input
                            type="number"
                            name="limit"
                            value={formData.limit}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Year:
                        <input
                            type="number"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Offset:
                        <input
                            type="number"
                            name="offset"
                            value={formData.offset}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Countries:
                        <Select
                            isMulti
                            name="countries"
                            options={countryOptions}
                            className="basic-multi-select mt-1"
                            classNamePrefix="select"
                            value={formData.countries}
                            onChange={handleCountriesChange}
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Sectors:
                        <Select
                            name="sectors"
                            options={sectorsOptions}
                            className="basic-single mt-1"
                            classNamePrefix="select"
                            onChange={handleSectorChange}
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Subsectors:
                        <Select
                            name="subsectors"
                            options={formData.sectors ? subSectorsOptions[formData.sectors] || [] : []}
                            className="basic-single mt-1"
                            classNamePrefix="select"
                            onChange={handleSubSectorChange}
                            isDisabled={!formData.sectors}
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Continents:
                        <input
                            type="text"
                            name="continents"
                            value={formData.continents}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Groups:
                        <input
                            type="text"
                            name="groups"
                            value={formData.groups}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Admin ID:
                        <input
                            type="number"
                            name="adminId"
                            value={formData.adminId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </label>
                </div>
                <button
                    type="submit"
                    className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Fetch Assets
                </button>
            </form>
            {error && <p className="mt-4 text-red-600">{error}</p>}
            {data.length > 0 && (
                <>
                    <BarChart data={chartData} title={chartTitle} />
                    <PieChart data={pieChartData} width={400} height={400} />
                    <AssetsTable data={data} prepareCSVData={prepareCSVData} />
                </>
            )}
        </div>
    );
};

export default AssetsForm;
