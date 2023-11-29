import Dexie from 'dexie';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Stock = () => {
    const [originalStore, setOriginalStore] = useState([]);
    const [store, setStore] = useState([]);
    const navigate = useNavigate();
    const [searchKey, setSearchKey] = useState('')

    const user = JSON.parse(localStorage.getItem("userData"));

    const db = new Dexie(`store_${user.name}`);
    db.version(4).stores({
        items: "name",// collection with keyPath name and
    });

    useEffect(() => {
        // function for get all data from indexeddb store collection
        async function getStore() {
            const storeData = await db.items.toArray();
            if (storeData.length > 0) {
                setOriginalStore(storeData);
                setStore(storeData);
            } else {
                setOriginalStore([]);
                setStore([]);
            }
        }

        getStore();
    }, [])


    const handleSearch = (e) => {
        e.preventDefault();
    
        try {
            if (searchKey.length !== 0) {
                const filter = originalStore.filter((item) => {
                    return item.name === searchKey;
                });
                setStore(filter);
            } else {
                // If searchKey is empty, return the original data
                setStore(originalStore);
            }
        } catch (error) {
            console.error(error);
        }
    }
    

    return (

        <div className="sale-content-parentdiv p-3">
            <div className="back-div">
                <span className="back" onClick={() => navigate(-1)}>&larr;</span><span className="mx-5 h6">Store</span>


                <div className='float-end'>
                    <form onSubmit={handleSearch}>
                        <input type="text" onChange={(e) => setSearchKey(e.target.value)} value={searchKey} placeholder='Enter Name' className='me-1 mt-2 store_search' />
                        <button type='submit' className="store_searchbtn btn btn-primary btn-sm">Search</button>
                    </form>
                </div>

            </div>

            <div className="text-center mt-4">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">S. No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Purchase Price</th>
                            <th scope="col">Sale Price</th>
                            <th scope="col">Available Stock</th>
                            <th scope="col">Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.length > 0 ? (
                            store.map((item, index) => (
                                <tr key={index}>
                                    <td scope="row">{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.purchasePrice}</td>
                                    <td>{item.salePrice ? item.salePrice : purchasePrice}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.unit}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <th className='text-danger' colSpan="4">Nothing to show</th>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default Stock
