import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
    const { fetchCurrentUser, user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchCurrentUser();
                setProfileData(data);
            } catch (err) {
                setError('Не удалось загрузить данные профиля');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [fetchCurrentUser]);

    if (loading) return <div style={{ padding: '20px' }}>Загрузка профиля...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '20px auto' }}>
            <h2>Профиль пользователя</h2>
            <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                <p><strong>Email:</strong> {profileData?.email || user?.email}</p>
                <p><strong>Роли в системе:</strong></p>
                <ul>
                    {profileData?.roles ? (
                        profileData.roles.map((role, idx) => <li key={idx}>{role}</li>)
                    ) : (
                        <li>{user?.role}</li>
                    )}
                </ul>
            </div>
        </div>
    );
};