import {useEffect, useState} from "react";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';


const CreateListing = () => {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const params = useParams();
    const [files, setFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls:[],
        name: '',
        description: '',
        address: '',
        type:'rent',
        bedrooms: 1,
        bathrooms : 1,
        regularPrice: 5000,
        discountPrice: 0,
        offer: false,
        parking : false,
        furnished : false,
    });
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setFormData(data);
            if (data.imageUrls && data.imageUrls.length > 0) {
                setImageUrls(data.imageUrls);
            }
        };

        fetchListing();
    }, [params.listingId]);

    const handleImageSubmit = async () => {
        if (files.length > 0 && files.length < 7) {
            const promises = files.map(storeImage);

            try {
                const urls = await Promise.all(promises);
                console.log("Uploaded Image URLs:", urls.flat());
                setImageUrls(urls.flat());
                setFormData((prev) => ({ ...prev, imageUrls: urls.flat() }));
                setFiles([]);
            } catch (error) {
                console.error("Image upload failed:", error);
            }
        }
    };


    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("images", file);

            fetch("/api/uploads/upload", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.fileUrls) {
                        resolve(data.fileUrls);
                    } else {
                        reject("Upload failed");
                    }
                })
                .catch((error) => reject(error));
        });
    };

    const removeImage = (index) => {
        setImageUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            });
        }
        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }

        if (
            e.target.type === 'number' ||
            e.target.type === 'text' ||
            e.target.type === 'textarea'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1)
                return setError('You must upload at least one image');
            if (+formData.regularPrice < +formData.discountPrice)
                return setError('Discount price must be lower than regular price');
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
            }
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Update a Listing</h1>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col flex-1 gap-4">
                    <input type="text" placeholder="Name" className="border p-3 rounded-lg" id="name" maxLength="62" minLength="10"  onChange={handleChange} value={formData.name} required />
                    <textarea type="text" placeholder="Description" className="border p-3 rounded-lg" id="description" onChange={handleChange} value={formData.description} required />
                    <input type="text" placeholder="Address" className="border p-3 rounded-lg" id="address" onChange={handleChange} value={formData.address} required />

                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id="sale" className="w-5" onChange={handleChange} checked={formData.type === "sale"}/>
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={formData.type === "rent"} />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={formData.parking} />
                            <span>Parking Spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={formData.furnished} />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className="w-5" onChange={handleChange} checked={formData.offer}/>
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input type="number" id="bedrooms" min="1" max="10" className="p-3 border-gray-300 rounded-lg"  onChange={handleChange}
                                   value={formData.bedrooms} required />
                            <p>Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id="bathrooms" min="1" max="10" className="p-3 border-gray-300 rounded-lg"  onChange={handleChange}
                                   value={formData.bathrooms} required />
                            <p>Baths</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id="regularPrice" min="5000" max="1000000" className="p-3 border-gray-300 rounded-lg"         onChange={handleChange}
                                   value={formData.regularPrice} required />
                            <div className="flex flex-col items-center">
                                <p>Regular price</p>
                                <span className="text-xs">(&#8377; / month)</span>
                            </div>
                        </div>
                        {formData.offer && (
                            <div className="flex items-center gap-2">
                                <input type="number" id="discountPrice" min="0" max="1000000" className="p-3 border-gray-300 rounded-lg"          onChange={handleChange}
                                       value={formData.discountPrice} required />
                                <div className="flex flex-col items-center">
                                    <p>Discounted price</p>
                                    <span className="text-xs">(&#8377; / month)</span>

                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">Images:
                        <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
                    </p>

                    <div className="flex gap-4">
                        <input
                            onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
                            className="p-3 border-gray-300 rounded w-full"
                            type="file"
                            id="images"
                            accept="image/*"
                            multiple
                        />
                        <button type="button" onClick={handleImageSubmit}
                                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
                            Upload
                        </button>
                    </div>


                    {imageUrls.length > 0 && (
                        <div className="mt-4">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="flex items-center justify-between border p-2 rounded">
                                    <img src={url} alt={`Uploaded ${index + 1}`} className="w-20 h-16 object-cover rounded" />
                                    <button
                                        type="button"
                                        className="text-red-500 text-sm"
                                        onClick={() => removeImage(index)}
                                    >
                                        DELETE
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button  disabled={loading} className="p-3 bg-blue-600 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
                        {loading ? 'Creating...' : 'Update listing'}
                    </button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
            </form>
        </main>
    );
};

export default CreateListing;
