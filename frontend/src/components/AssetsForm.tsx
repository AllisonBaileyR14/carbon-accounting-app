import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { fetchAssets } from '../services/api';
import { Asset, Emission, EmissionDetail } from '../types/types';
import BarChart from './BarChart';
import AssetsTable from './AssetsTable';
import { getNames, getCodeList } from 'country-list';

const sectorsOptions = [
    { value: 'power', label: 'Power' },
    { value: 'transport', label: 'Transport' },
    { value: 'manufacturing', label: 'Manufacturing' },
    // Add more sectors as needed
];

const countriesOptions = getNames().map(name => ({ value: getCodeList()[name], label: name }));

const AssetsForm = () => {
    const [formData, setFormData] = useState({
        limit: 100,
        year: 2022,
        offset: 0,
        countries: [],
        sectors: '',
        subsectors: '',
        continents: '',
        groups: '',
        adminId: 1,
    });

    const [data, setData] = useState<Asset[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<{ country: string; co2: number }[]>([]);
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
            countries: selectedOptions ? selectedOptions.map((option: any) => option.value) : [],
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const assets = await fetchAssets(formData);
            setData(assets);
            setError(null);
            setChartTitle(`Countries: ${formData.countries.join(', ')}, Year: ${formData.year}, Sector: ${formData.sectors}, Emissions: CO2`);
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
                                console.log(`Adding CO2 for ${country}: ${detail.co2}`);
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

            console.log('Aggregated chart data:', chartDataArray);
            setChartData(chartDataArray);
        };

        aggregateCO2ByCountry();
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
                            options={countriesOptions}
                            className="basic-multi-select mt-1"
                            classNamePrefix="select"
                            onChange={handleCountriesChange}
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
                        <input
                            type="text"
                            name="subsectors"
                            value={formData.subsectors}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                    <AssetsTable data={data} prepareCSVData={prepareCSVData} />
                </>
            )}
        </div>
    );
};

export default AssetsForm;
