import Dexie from 'dexie';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Add from "../images/add.png"
import Shopping from "../images/shopping-bags.png"

import Input from '@mui/material/Input';
import Fab from '@mui/material/Fab';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import RightArrow from "../images/arrow.png"

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "94%",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    margin: "0 auto",
    borderRadius: "15px",
};


const ariaLabel = { 'aria-label': 'description' };

const Stock = () => {
    const [originalStore, setOriginalStore] = useState([]);
    const [store, setStore] = useState([]);
    const navigate = useNavigate();
    const [searchKey, setSearchKey] = useState('')

    const user = JSON.parse(localStorage.getItem("userData"));

    // const db = new Dexie(`store_${user.name}`);
    const db = new Dexie(`store`);
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

    const handleChange = (e) => {
        if (e.target.value.length === 0) {
            setStore(originalStore);
        }
        setSearchKey(e.target.value);
    }

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

    const [open, setOpen] = React.useState(false);
    const [item, setItem] = useState(null)
    const handleOpen = (item) => {
        setItem(item)
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    {item &&
                        <Box sx={style}>
                            <Typography className='border-bottom pb-2' id="transition-modal-title" variant="h6" component="h2">
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className='w-100'>
                                        <div className="clent-name clent-names">
                                            {item.name}
                                        </div>
                                    </div>
                                </div>
                            </Typography>

                            <Typography id="transition-modal-description"
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    rowGap: "21px",
                                    mt: 2,
                                    lineHeight: "1"
                                }}>
                                <div className='stock-item'>
                                    <div className='clent-tag fw-bolder'>Sale Price</div>
                                    <div className='clent-quote'>{item.salePrice ? item.salePrice : "00"}.00 ₹</div>
                                </div>
                                <div className='stock-item'>
                                    <div className='clent-tag'>Quantity</div>
                                    <div className='quote'>{item.quantity}</div>
                                </div>
                                <div className='stock-item'>
                                    <div className='clent-tag'>Unit</div>
                                    <div className='quote'>{item.unit}</div>
                                </div>
                                <div className='stock-item'>
                                    <div className='clent-tag fw-bold'>Purchase Price</div>
                                    <div className='clent-quote '>{item.purchasePrice}.00 ₹</div>
                                </div>
                            </Typography>
                        </Box>
                    }

                </Fade>
            </Modal>

            <div className="sale-content-parentdiv">
                <Paper
                    sx={{
                        padding: "11px",
                    }}
                    className='nav-paper'
                >
                    <div className="ba">
                        <span className="back" onClick={() => navigate(-1)}>
                            <img src={RightArrow} width="100%" alt="" />
                        </span>
                        <span className="mx-5 h6">Store</span>
                    </div>
                </Paper>

                <div className=''>
                    <form onSubmit={handleSearch}>
                        <div style={{ padding: "0 20px" }}>
                            <Input className='w-75 mt-4 me-2' onChange={(e) => handleChange(e)} value={searchKey} placeholder='Search with name' inputProps={ariaLabel} />

                            <Fab
                                sx={{
                                    height: "55px",
                                    margin: "15px 0",
                                    width: "20%"
                                }}
                                onClick={handleSearch}
                                variant="extended">
                                <SearchIcon sx={{
                                    height:"2.5rem",
                                    width: "2em",
                                }} />
                            </Fab>
                        </div>

                    </form>
                </div>

                <div className="mt-4 main-content-child">

                    {store.length > 0 ? (
                        store.map((item, index) => (
                            <div key={index} className='stk-item' onClick={() => handleOpen(item)}>
                                <div className='stk-item1'>
                                    <div className="bag-img">
                                        <img width="100%" src={Shopping} alt="" />
                                    </div>
                                    <div className='stk-name'>
                                        {item.name}
                                    </div>
                                </div>
                                <div className='stk-item2'>
                                    <div className='stk-price'>{item.salePrice ? item.salePrice : item.purchasePrice} ₹</div>
                                    <div className='stk-qty'>Stock: {item.quantity} {item.unit}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                padding: "0 10px",
                                cursor: "pointer",
                            }}
                            onClick={() => navigate("/purchase")}
                        >

                            <div className='w-100' style={{
                                border: "1px dashed black",
                                padding: "44px"
                            }}>
                                <img src={Add} alt="" style={{ width: "20%" }} />
                                <div className='my-3'>
                                    No item available tap to add
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </>
    )
}

export default Stock
