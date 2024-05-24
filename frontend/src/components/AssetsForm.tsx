import React, { useState, useEffect } from 'react';
import { fetchAssets } from '../services/api';
import { Asset, EmissionDetail } from '../types/types';
import BarChart from './BarChart';
import { CSVLink } from 'react-csv';

const AssetsForm = () => {
    const [formData, setFormData] = useState({
        limit: 100,
        year: 2022,
        offset: 0,
        countries: 'USA',
        sectors: 'power',
        subsectors: '',
        continents: '',
        groups: '',
        adminId: 1,
    });

    const [data, setData] = useState<Asset[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<{ country: string; co2: number }[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const assets = await fetchAssets(formData);
            setData(assets);
            setError(null);
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
                asset.Emissions.forEach((emission) => {
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
            asset.Emissions.forEach((emission) => {
                Object.entries(emission).forEach(([year, details]) => {
                    details.forEach((detail: EmissionDetail) => {
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
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Limit:
                        <input type="number" name="limit" value={formData.limit} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Year:
                        <input type="number" name="year" value={formData.year} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Offset:
                        <input type="number" name="offset" value={formData.offset} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Countries:
                        <input type="text" name="countries" value={formData.countries} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Sectors:
                        <input type="text" name="sectors" value={formData.sectors} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Subsectors:
                        <input type="text" name="subsectors" value={formData.subsectors} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Continents:
                        <input type="text" name="continents" value={formData.continents} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Groups:
                        <input type="text" name="groups" value={formData.groups} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Admin ID:
                        <input type="number" name="adminId" value={formData.adminId} onChange={handleChange} />
                    </label>
                </div>
                <button type="submit">Fetch Assets</button>
            </form>
            {error && <p>Error: {error}</p>}
            {data.length > 0 && (
                <>
                    <BarChart data={chartData} />
                    <div style={{ maxHeight: '400px', overflowY: 'scroll', marginTop: '20px' }}>
                        <CSVLink
                            data={prepareCSVData()}
                            filename={`assets_data_${formData.year}.csv`}
                            className="btn btn-primary"
                            style={{ marginBottom: '10px' }}
                        >
                            Export CSV
                        </CSVLink>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Country</th>
                                    <th>Sector</th>
                                    <th>Asset Type</th>
                                    <th>Reporting Entity</th>
                                    <th>Year</th>
                                    <th>Activity</th>
                                    <th>Activity Units</th>
                                    <th>Capacity</th>
                                    <th>Capacity Factor</th>
                                    <th>Capacity Units</th>
                                    <th>Emissions Factor</th>
                                    <th>Emissions Factor Units</th>
                                    <th>CO2</th>
                                    <th>CH4</th>
                                    <th>N2O</th>
                                    <th>CO2e 20yr</th>
                                    <th>CO2e 100yr</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((asset) => (
                                    <React.Fragment key={asset.Id}>
                                        {asset.Emissions.map((emission) =>
                                            Object.entries(emission).map(([year, emissionArray]) => (
                                                <React.Fragment key={year}>
                                                    {emissionArray.map((detail: EmissionDetail, index) => (
                                                        <tr key={index}>
                                                            {index === 0 && (
                                                                <>
                                                                    <td rowSpan={emissionArray.length}>{asset.Id}</td>
                                                                    <td rowSpan={emissionArray.length}>{asset.Name}</td>
                                                                    <td rowSpan={emissionArray.length}>{asset.Country}</td>
                                                                    <td rowSpan={emissionArray.length}>{asset.Sector}</td>
                                                                    <td rowSpan={emissionArray.length}>{asset.AssetType}</td>
                                                                    <td rowSpan={emissionArray.length}>{asset.ReportingEntity}</td>
                                                                </>
                                                            )}
                                                            <td>{year}</td>
                                                            <td>{detail.Activity !== null ? detail.Activity : 'N/A'}</td>
                                                            <td>{detail.ActivityUnits !== null ? detail.ActivityUnits : 'N/A'}</td>
                                                            <td>{detail.Capacity !== null ? detail.Capacity : 'N/A'}</td>
                                                            <td>{detail.CapacityFactor !== null ? detail.CapacityFactor : 'N/A'}</td>
                                                            <td>{detail.CapacityUnits !== null ? detail.CapacityUnits : 'N/A'}</td>
                                                            <td>{detail.EmissionsFactor !== null ? detail.EmissionsFactor : 'N/A'}</td>
                                                            <td>{detail.EmissionsFactorUnits !== null ? detail.EmissionsFactorUnits : 'N/A'}</td>
                                                            <td>{detail.co2 !== null ? detail.co2 : 'N/A'}</td>
                                                            <td>{detail.ch4 !== null ? detail.ch4 : 'N/A'}</td>
                                                            <td>{detail.n2o !== null ? detail.n2o : 'N/A'}</td>
                                                            <td>{detail.co2e_20yr !== null ? detail.co2e_20yr : 'N/A'}</td>
                                                            <td>{detail.co2e_100yr !== null ? detail.co2e_100yr : 'N/A'}</td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default AssetsForm;
