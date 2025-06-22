import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SEO from "@/components/seo";
import { Shield, Eye, Lock, Server } from "lucide-react";

export default function PrivacyPolicy() {
    const [, setLocation] = useLocation();

    return (
        <div className="min-h-screen bg-gray-50">
            <SEO
                title="Privacy Policy - Your Data Security | docFlow"
                description="Learn how docFlow protects your privacy. Our image compression tool processes all images locally in your browser - your data never leaves your device."
                keywords="privacy policy, data security, image compression privacy, browser-based processing"
                canonical="https://yourwebsite.com/privacy-policy"
            />
            <Header />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <Shield className="h-12 w-12 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Your privacy is our top priority. Learn how we protect your data and ensure your images remain secure.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Key Privacy Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                        <Eye className="h-8 w-8 text-green-600 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">Local Processing</h3>
                        <p className="text-sm text-gray-600">All image compression happens in your browser. Your images never leave your device.</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                        <Lock className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">No Storage</h3>
                        <p className="text-sm text-gray-600">We don't store, save, or transmit your images to our servers.</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                        <Server className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">No Registration</h3>
                        <p className="text-sm text-gray-600">Use our tool without creating an account or providing personal information.</p>
                    </div>
                </div>

                {/* Privacy Policy Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="prose max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                            <p className="text-gray-600 mb-4">
                                <strong>No Personal Data:</strong> We do not collect, store, or process any personal information from our users.
                            </p>
                            <p className="text-gray-600 mb-4">
                                <strong>No Image Data:</strong> Your images are processed entirely within your web browser. They are never uploaded to our servers or stored anywhere.
                            </p>
                            <p className="text-gray-600">
                                <strong>Analytics:</strong> We may use anonymous analytics to understand how our service is used, but this data cannot identify individual users.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Process Images</h2>
                            <p className="text-gray-600 mb-4">
                                Our image compression tool uses client-side processing technology:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Images are loaded directly into your browser's memory</li>
                                <li>Compression algorithms run locally on your device</li>
                                <li>Processed images are available for immediate download</li>
                                <li>No data is transmitted to external servers</li>
                                <li>All temporary data is cleared when you close the browser</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Security</h2>
                            <p className="text-gray-600 mb-4">
                                We implement several security measures to protect your privacy:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>HTTPS encryption for all website communications</li>
                                <li>No server-side image storage or processing</li>
                                <li>Automatic cleanup of temporary browser data</li>
                                <li>Regular security audits of our codebase</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Services</h2>
                            <p className="text-gray-600 mb-4">
                                We may use the following third-party services:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li><strong>Google Analytics:</strong> Anonymous usage statistics (no personal data)</li>
                                <li><strong>Google AdSense:</strong> Display advertisements (subject to Google's privacy policy)</li>
                                <li><strong>CDN Services:</strong> Content delivery for faster loading</li>
                            </ul>
                            <p className="text-gray-600 mt-4">
                                These services have their own privacy policies, and we encourage you to review them.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking</h2>
                            <p className="text-gray-600 mb-4">
                                We use minimal cookies for essential website functionality:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Session cookies for temporary data during compression</li>
                                <li>Analytics cookies for anonymous usage statistics</li>
                                <li>No tracking cookies for advertising or personalization</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
                            <p className="text-gray-600 mb-4">
                                Since we don't collect personal data, there's no personal information to access, modify, or delete. However, you have the right to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Use our service without providing any personal information</li>
                                <li>Clear your browser data at any time</li>
                                <li>Disable cookies in your browser settings</li>
                                <li>Contact us with privacy-related questions</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
                            <p className="text-gray-600">
                                Our service is not intended for children under 13. Since we don't collect personal information,
                                we don't knowingly collect data from children under 13. If you believe we have inadvertently
                                collected such information, please contact us immediately.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
                            <p className="text-gray-600">
                                We may update this privacy policy from time to time. We will notify users of any material changes
                                by posting the new policy on this page and updating the "Last updated" date. Your continued use
                                of our service after any changes constitutes acceptance of the updated policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
                            <p className="text-gray-600">
                                If you have any questions about this privacy policy or our data practices, please contact us at:
                            </p>
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-gray-600">
                                    <strong>Email:</strong> privacy@yourwebsite.com<br />
                                    <strong>Address:</strong> [Your Company Address]<br />
                                    <strong>Website:</strong> https://yourwebsite.com
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-12 text-center">
                    <button
                        onClick={() => setLocation('/')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Image Compressor
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
} 