import React, { useState } from 'react';
import { fetchAssets } from '../services/api';
import { Asset, Emission, Owner, Confidence, EmissionDetail, ConfidenceDetail } from '../types/types';

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
                        {data.map((asset) => {
                            const totalEmissionRows = asset.Emissions.reduce((acc, emission) => acc + Object.values(emission).flat().length, 0);
                            return (
                                <React.Fragment key={asset.Id}>
                                    {asset.Emissions.map((emission: Emission, emissionIndex: number) => (
                                        <React.Fragment key={emissionIndex}>
                                            {Object.entries(emission).map(([year, details], yearIndex) => (
                                                details.map((detail: EmissionDetail, detailIndex) => (
                                                    <tr key={`${year}-${detailIndex}`}>
                                                        {emissionIndex === 0 && yearIndex === 0 && detailIndex === 0 && (
                                                            <>
                                                                <td rowSpan={totalEmissionRows}>{asset.Id}</td>
                                                                <td rowSpan={totalEmissionRows}>{asset.Name}</td>
                                                                <td rowSpan={totalEmissionRows}>{asset.Country}</td>
                                                                <td rowSpan={totalEmissionRows}>{asset.Sector}</td>
                                                                <td rowSpan={totalEmissionRows}>{asset.AssetType}</td>
                                                                <td rowSpan={totalEmissionRows}>{asset.ReportingEntity}</td>
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
                                                ))
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AssetsForm;
