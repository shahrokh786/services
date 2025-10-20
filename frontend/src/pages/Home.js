import React, { useState, useEffect } from 'react';
import serviceService from '../services/serviceService';
import ServiceCard from '../components/ServiceCard'; // <-- Import our new, modern component
import styles from '../styles'; // We still use this for the Hero and other sections for now

const Home = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            try {
                setLoading(true);
                const response = await serviceService.getAllServices();
                setServices(response.data);
            } catch (error) {
                console.error('Failed to load services:', error);
            } finally {
                setLoading(false);
            }
        };
        loadServices();
    }, []);

    return (
        <>
            {/* Hero Section (remains styled by styles.js) */}
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>Find Trusted Local Service Providers</h1>
                    <p style={styles.heroSubtitle}>Connect with skilled professionals in your neighborhood</p>
                    <button style={styles.ctaButton}>Find Services Near You</button>
                </div>
            </section>

            {/* Services Section - NOW STYLED WITH TAILWIND CSS */}
            <section className="bg-gray-50 py-16 px-4">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Available Services</h2>
                <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        <p className="text-center col-span-full">Loading services...</p>
                    ) : services.length > 0 ? (
                        // We now map over our data and render the new, self-contained ServiceCard
                        services.map(service => (
                            <ServiceCard key={service._id} service={service} />
                        ))
                    ) : (
                        <p className="text-center col-span-full">No services are available at the moment.</p>
                    )}
                </div>
            </section>

            {/* Categories Section (remains styled by styles.js for now) */}
            <section style={styles.categories}>
                <h2 style={styles.sectionTitle}>Service Categories</h2>
                <div style={styles.categoriesGrid}>
                    {['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'Other'].map((category) => (
                        <div key={category} style={styles.categoryCard}>
                            <h3>{category}</h3>
                            <p>50+ Providers</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default Home;

