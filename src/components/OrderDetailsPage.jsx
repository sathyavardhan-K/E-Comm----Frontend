// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Container, Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
// import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
// import { useAuth } from '../AuthContext';

// const OrderDetailsPage = () => {
//     const { userId } = useAuth(); 
//     const [orderDetails, setOrderDetails] = useState([]); // Use an empty array to handle multiple orders
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (userId) {
//             axios
//                 .get(`https://e-comm-backend-dc49.onrender.com/api/orders/user/${userId}`)
//                 .then((response) => {
//                     setOrderDetails(response.data.reverse());
//                     setLoading(false);
//                 })
//                 .catch((error) => {
//                     setError('Error fetching order details');
//                     setLoading(false);
//                     console.error('Error fetching order details:', error.response ? error.response.data : error.message);
//                 });
//         }
//     }, [userId]);

//     // Helper function to format date
//     const formatDate = (isoDateString) => {
//         if (!isoDateString) return 'N/A';
//         const date = new Date(isoDateString);
//         return date.toLocaleDateString('en-US', {
//             month: '2-digit',
//             day: '2-digit',
//             year: 'numeric',
//         });
//     };

//     // Function to render icons based on order status
//     const renderStatusIcon = (status) => {
//         switch (status?.toLowerCase()) {
//             case 'completed':
//                 return <CheckCircleOutlineIcon color="success" />;
//             case 'cancelled':
//                 return <CancelOutlinedIcon color="error" />;
//             case 'pending':
//                 return <PendingOutlinedIcon color="warning" />;
//             default:
//                 return <PendingOutlinedIcon color="action" />;
//         }
//     };

//     // If no orders are available
//     if (!orderDetails.length) {
//         return (
//             <Container component="main" maxWidth="md" sx={{ mt: 10 }}>
//                 <Typography variant="h6">No order details available</Typography>
//             </Container>
//         );
//     }

//     return (
//         <Container component="main" maxWidth="lg" sx={{ mt: 10, mb: 10 }}>
//             <Paper elevation={3} sx={{ padding: 4 }}>
//                 <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#000' }}>
//                     Order Details
//                 </Typography>

//                 {/* Render Each Order in Table */}
//                 {orderDetails.map((order, index) => {
//                     const reverseIndex = orderDetails.length - index; // Calculate reverse order number
//                     const totalPrice = order.payment?.totalPrice?.$numberDecimal || 0;
//                     const formattedPrice = typeof totalPrice === 'number' ? totalPrice.toFixed(2) : parseFloat(totalPrice).toFixed(2);

//                     return (
//                         <Box key={index} sx={{ mb: 4 }}>
//                             <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>Order {reverseIndex}</Typography>
//                             <TableContainer component={Paper} sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 2, boxShadow: 2 }}>
//                                 <Table>
//                                     <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//                                         <TableRow>
//                                             {['Order ID', 'Order Date', 'Status', 'Delivery Date', 'Products', 'Total Price', 'Payment Status'].map((header, index) => (
//                                                 <TableCell key={index} sx={{ fontWeight: 'bold', color: '#2e1065' }}>
//                                                     {header}
//                                                 </TableCell>
//                                             ))}
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
//                                             <TableCell>{order._id || 'N/A'}</TableCell>
//                                             <TableCell>{formatDate(order.createdAt)}</TableCell>
//                                             <TableCell>
//                                                 <Chip
//                                                     icon={renderStatusIcon(order.status)}
//                                                     label={order.status || 'N/A'}
//                                                     variant="outlined"
//                                                     color={
//                                                         order.status?.toLowerCase() === 'completed'
//                                                             ? 'success'
//                                                             : order.status?.toLowerCase() === 'cancelled'
//                                                             ? 'error'
//                                                             : 'warning'
//                                                     }
//                                                 />
//                                             </TableCell>
//                                             <TableCell>{order.reachedDate ? formatDate(order.reachedDate) : 'N/A'}</TableCell>

//                                             <TableCell>
//                                                 {order.products?.length > 0 ? (
//                                                     order.products.map((product, index) => (
//                                                         <Box key={index} mb={1}>
//                                                             <Typography variant="body2">
//                                                                 <strong>ID:</strong> {product.product_id || 'N/A'}, <strong>Product Name:</strong> {product.productName || 'N/A'}, <strong>Qty:</strong> {product.orderQuantity || 'N/A'}
//                                                             </Typography>
//                                                         </Box>
//                                                     ))
//                                                 ) : (
//                                                     <Typography variant="body2">No products available</Typography>
//                                                 )}
//                                             </TableCell>

//                                             <TableCell>₹{formattedPrice || '0.00'}</TableCell>
//                                             <TableCell>
//                                                 <Chip
//                                                     label={order.paymentStatus || 'N/A'}
//                                                     color={
//                                                         order.paymentStatus?.toLowerCase() === 'paid'
//                                                             ? 'success'
//                                                             : order.paymentStatus?.toLowerCase() === 'unpaid'
//                                                             ? 'error'
//                                                             : 'warning'
//                                                     }
//                                                     variant="outlined"
//                                                 />
//                                             </TableCell>
//                                         </TableRow>
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                         </Box>
//                     );
//                 })}
//             </Paper>
//         </Container>
//     );
// };

// export default OrderDetailsPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import { useAuth } from '../AuthContext';

const OrderDetailsPage = () => {
    const { userId } = useAuth();
    const [orderDetails, setOrderDetails] = useState([]); // Use an empty array to handle multiple orders
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId) {
            axios
                .get(`https://e-comm-backend-dc49.onrender.com/api/orders/user/${userId}`)
                .then((response) => {
                    setOrderDetails(response.data.reverse());
                    setLoading(false);
                })
                .catch((error) => {
                    setError('Error fetching order details');
                    setLoading(false);
                    console.error('Error fetching order details:', error.response ? error.response.data : error.message);
                });
        }
    }, [userId]);

    // Helper function to format date
    const formatDate = (isoDateString) => {
        if (!isoDateString) return 'N/A';
        const date = new Date(isoDateString);
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        });
    };

    // Function to render icons based on order status
    const renderStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return <CheckCircleOutlineIcon color="success" />;
            case 'cancelled':
                return <CancelOutlinedIcon color="error" />;
            case 'pending':
                return <PendingOutlinedIcon color="warning" />;
            default:
                return <PendingOutlinedIcon color="action" />;
        }
    };

    if (loading) {
        // Show loading screen while fetching data
        return (
            <Container component="main" maxWidth="md" sx={{ mt: 10, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading order details...</Typography>
            </Container>
        );
    } else if (error) {
        // Show error message if fetching fails
        return (
            <Container component="main" maxWidth="md" sx={{ mt: 10 }}>
                <Typography variant="h6" color="error">{error}</Typography>
            </Container>
        );
    } else if (!orderDetails.length) {
        // Display message if no order details are available
        return (
            <Container component="main" maxWidth="md" sx={{ mt: 10 }}>
                <Typography variant="h6">No order details available</Typography>
            </Container>
        );
    } else {
        // Render order details when data is available
        return (
            <Container component="main" maxWidth="lg" sx={{ mt: 10, mb: 10 }}>
                <Paper elevation={3} sx={{ padding: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#000' }}>
                        Order Details
                    </Typography>

                    {/* Render Each Order in Table */}
                    {orderDetails.map((order, index) => {
                        const reverseIndex = orderDetails.length - index; // Calculate reverse order number
                        const totalPrice = order.payment?.totalPrice?.$numberDecimal || 0;
                        const formattedPrice = typeof totalPrice === 'number' ? totalPrice.toFixed(2) : parseFloat(totalPrice).toFixed(2);

                        return (
                            <Box key={index} sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>Order {reverseIndex}</Typography>
                                <TableContainer component={Paper} sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 2, boxShadow: 2 }}>
                                    <Table>
                                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                            <TableRow>
                                                {['Order ID', 'Order Date', 'Status', 'Delivery Date', 'Products', 'Total Price', 'Payment Status'].map((header, index) => (
                                                    <TableCell key={index} sx={{ fontWeight: 'bold', color: '#2e1065' }}>
                                                        {header}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
                                                <TableCell>{order._id || 'N/A'}</TableCell>
                                                <TableCell>{formatDate(order.createdAt)}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={renderStatusIcon(order.status)}
                                                        label={order.status || 'N/A'}
                                                        variant="outlined"
                                                        color={
                                                            order.status?.toLowerCase() === 'completed'
                                                                ? 'success'
                                                                : order.status?.toLowerCase() === 'cancelled'
                                                                ? 'error'
                                                                : 'warning'
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>{order.reachedDate ? formatDate(order.reachedDate) : 'N/A'}</TableCell>

                                                <TableCell>
                                                    {order.products?.length > 0 ? (
                                                        order.products.map((product, index) => (
                                                            <Box key={index} mb={1}>
                                                                <Typography variant="body2">
                                                                    <strong>ID:</strong> {product.product_id || 'N/A'}, <strong>Product Name:</strong> {product.productName || 'N/A'}, <strong>Qty:</strong> {product.orderQuantity || 'N/A'}
                                                                </Typography>
                                                            </Box>
                                                        ))
                                                    ) : (
                                                        <Typography variant="body2">No products available</Typography>
                                                    )}
                                                </TableCell>

                                                <TableCell>₹{formattedPrice || '0.00'}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={order.paymentStatus || 'N/A'}
                                                        color={
                                                            order.paymentStatus?.toLowerCase() === 'paid'
                                                                ? 'success'
                                                                : order.paymentStatus?.toLowerCase() === 'unpaid'
                                                                ? 'error'
                                                                : 'warning'
                                                        }
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        );
                    })}
                </Paper>
            </Container>
        );
    }
};

export default OrderDetailsPage;

