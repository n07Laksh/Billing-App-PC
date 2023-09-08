import Dexie from 'dexie';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Stock = () => {
    const [store, setStore] = useState(null);
    const navigate = useNavigate();

    const db = new Dexie("store");
    db.version(4).stores({
        items: "name",// collection with keyPath name and
    });

    useEffect(() => {
        // function for get all data from indexeddb store collection
        async function getStore() {
            const storeData = await db.items.toArray();
            storeData.length > 0 ? setStore(storeData) : setStore(null);
        }

        getStore();
    }, [])


    return (

        <div className="sale-content-parentdiv">
            <div className="back-div">
                <span className="back" onClick={() => navigate(-1)}>&larr;</span><span className="mx-5 h6">Store</span>
            </div>

            <div className="text-center mt-4">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">S. No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Purchase Price</th>
                            <th scope="col">Available Stock</th>
                            <th scope="col">Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store ? (
                            store.map((item, index) => (
                                <tr key={index}>
                                    <td scope="row">{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.salePrice}</td>
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
