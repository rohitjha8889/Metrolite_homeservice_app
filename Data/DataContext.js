// DataContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { getCurrentDateIST, getCurrentTimeIST } = require('../components/DateandTime')

const DataContext = createContext();
const currentDateIST = getCurrentDateIST();

// Get current time in IST
const currentTimeIST = getCurrentTimeIST();


const DataContextProvider = ({ children }) => {
  const [slider, setSlider] = useState([]);
  const [service, setService] = useState([]);
  const [subServices, setSubServices] = useState([])
  const [parentCategory, setParentCategory] = useState([])
  const [fakedata, setFakeData] = useState([])
  const [productDetail, setProductDetail] = useState([])

  const IP_ADDRESS = 'https://metrolite.co.in:5000'
  // server ip = 'https://metrolite.co.in:5000'
  // Local ip =  http://192.168.1.5:5000


  // Products
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    fetchData();
    fetchService();
    fetchAllProduct();

  }, []);





  // Fetch Data refers to fetch Banner 
  const fetchData = async () => {
    try {
      // Fetch data from API
      const response = await fetch(`${IP_ADDRESS}/allposter`);
      const jsonData = await response.json();


      setSlider(jsonData.reverse());



    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchService = async () => {
    try {
      const response = await fetch(`${IP_ADDRESS}/allcategories`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const jsonData = await response.json();
      setService(jsonData.reverse());
    } catch (error) {
      console.error('Error fetching service data:', error);
    }
  };

  const fetchSubServices = async (serviceId) => {
    try {
      const response = await fetch(`${IP_ADDRESS}/categories/${serviceId}/children`);
      if (!response.ok) {
        throw new Error('Failed to fetch sub-services');
      }
      const jsonData = await response.json();
      setSubServices(jsonData)
    } catch (error) {
      console.error('Error fetching sub-service data:', error);
      return [];
    }
  };

  const fetchServiceById = async (clientId) => {
    try {
      const response = await fetch(`${IP_ADDRESS}/categories/${clientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch specific category');
      }
      const jsonData = await response.json();
      setParentCategory(jsonData)
    } catch (error) {
      console.error('Error fetching specific category:', error);
      return [];
    }
  }


  // Fetch All products

  const fetchAllProduct = async () => {
    try {
      const response = await fetch(`${IP_ADDRESS}/getallproduct`);
      if (!response.ok) {
        throw new Error('Failed to fetch all product');
      }
      const jsonData = await response.json();
      setAllProducts(jsonData.reverse());

    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };


  const fetchProductDetail = async (productId) => {
    try {
      const response = await fetch(`${IP_ADDRESS}/getproduct/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch all product');
      }
      const jsonData = await response.json();
      setProductDetail(jsonData);

    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  }





  // User Api




  const [userDetail, setUserDetail] = useState([]);
  const [userAddress, setUserAddress] = useState([]);
  const [addressDetail, setAddressDetail] = useState([])

  useEffect(() => {
    fetchUserDetail();
    fetchUserAddress()
    fetchAllCartItem()

  }, []);

  const fetchUserId = async () => {
    try {
      const storedId = await AsyncStorage.getItem('userID');
      return storedId;
    } catch (error) {
      console.error('Error fetching user ID from AsyncStorage:', error);
      return null; // Return null or handle the error appropriately
    }
  };

  const fetchUserDetail = async () => {
    const userId = await fetchUserId(); // Await fetchUserId() to get the actual userId
    if (!userId) {
      // console.error('userId is not present');
      return; // Exit the function if userId is not present
    }

    // console.log("Async Storage Id : ", userId);
    try {
      const response = await fetch(`${IP_ADDRESS}/user/profiledetail/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user detail');
      }
      const jsonData = await response.json();
      setUserDetail(jsonData);
    } catch (error) {
      console.error('Error fetching user detail:', error);
    }
  };

  const createUserProfile = async (phone, emailId, userName) => {
    try {
      const response = await fetch(`${IP_ADDRESS}/user/userprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, emailId, userName }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user profile');
      }

      const userProfile = await response.json();
      if (userProfile.error) {
        // Phone number already exists, log the message
        // console.log('Number is already registered');
        return null; // or handle as needed
      }

      const userID = userProfile._id; // Assuming _id is the ID field in the response
      // console.log(userID)
      // Store user ID in AsyncStorage
      await AsyncStorage.setItem('userID', userID);

      fetchUserDetail()
      return userProfile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error(error.message);
    }
  };


  const userProfileImage = async (imageUri) => {
    const userId = await fetchUserId(); // Assuming this function returns the user ID
    try {
      const formData = new FormData();
      formData.append('profilepic', {
        uri: imageUri,
        name: 'profile_image.jpg', // You can change the file name as needed
        type: 'image/jpeg', // Adjust the image type if necessary
      });

      const response = await fetch(`${IP_ADDRESS}/user/${userId}/profilepic`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update user profile picture');
      }

      const responseData = await response.json();
      fetchUserDetail()
      return responseData;
    } catch (error) {
      console.error('Error updating user profile picture:', error);
      throw error;
    }
  };


  const logOut = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      // console.log('Data deleted successfully.');
    } catch (error) {
      console.error('Error deleting data from AsyncStorage:', error);
      throw new Error(error.message);
    }
  };



  // Address Api

  const addAddress = async (formData) => {

    try {
      const response = await fetch(`${IP_ADDRESS}/user/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Handle response
      if (response.ok) {
        const responseData = await response.json();
        // console.log('Address added successfully:', responseData);
        fetchUserAddress()
        // Handle successful response
      } else {
        throw new Error('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      // Handle error
    }
  }


  const fetchUserAddress = async () => {
    const userId = await fetchUserId();
    // console.log(userId)
    if (!userId) {
      // console.error('userId is not present');
      return; // Exit the function if userId is not present
    }

    // console.log("Async Storage Id : ", userId);
    try {
      const response = await fetch(`${IP_ADDRESS}/user/addresses/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user detail');
      }
      const jsonData = await response.json();
      setUserAddress(jsonData.reverse());
    } catch (error) {
      console.error('Error fetching user detail:', error);
    }
  };


  const deleteAddress = async (addressId) => {
    try {
      // Assuming your API endpoint for deleting an address is '/api/addresses/:id'
      const response = await fetch(`${IP_ADDRESS}/user/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',

        },
      });

      if (response.ok) {
        // Address deleted successfully
        // console.log('Address deleted successfully');

        fetchUserAddress()
        // You may return some data if needed
        return true;
      } else {
        // Handle error response
        console.error('Failed to delete address:', response.statusText);
        return false;
      }
    } catch (error) {
      // Handle network errors
      console.error('Error deleting address:', error);
      return false;
    }
  };


  const modifyAddress = async (addressId, updatedAddressData) => {
    try {
      // console.log(addressId);
      // console.log(updatedAddressData);
      const response = await fetch(`${IP_ADDRESS}/user/addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAddressData),
      });

      if (response.ok) {
        // Address successfully updated
        // console.log('Success', 'Address updated successfully');
        fetchUserAddress()
      } else {
        // Handle error response
        // console.log('Error', 'Failed to update address');
      }
    } catch (error) {
      // Handle network errors or other errors
      console.error('Error modifying address:', error);
    }
  };



  const fetchAddressDetail = async (addressId) => {

    // console.log("Async Storage Id : ", userId);
    try {
      const response = await fetch(`${IP_ADDRESS}/user/address/${addressId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Address detail');
      }
      const jsonData = await response.json();
      // console.log(jsonData)
      setAddressDetail(jsonData);
    } catch (error) {
      console.error('Error fetching user detail:', error);
    }
  };






  // Add To cart 


  const safetyFee = 0;
  // const slotFee = 150;

  // const gstandFee = 0;


  const [allCartItem, setAllCartItem] = useState([])
  const [totalCartPrice, setTotalCartPrice] = useState();
  const [gstAndOther, setgstAndOther] = useState()
  const [totalPriceWithSlot, setTotalPriceWithSlot] = useState(totalCartPrice)
  const [cartItemNumber, setCartItemNumber] = useState()

  useEffect(() => {
    fetchAllCartItem()
    fetchCartItemNumber()
    // console.log(allCartItem)
    fetchAllOrder()
  }, [])


  const addToCart = async (productId, quantity) => {
    const userId = await fetchUserId();
    try {
      const response = await fetch(`${IP_ADDRESS}/user/add-to-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if required
        },
        body: JSON.stringify({
          userId: userId,
          productId: productId,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // console.log('Item added to cart:', data);
        await fetchAllCartItem()
        // Optionally, you can return the added item data or perform other actions
        return data;
      } else {
        console.error('Failed to add item to cart:', response.statusText);
        // Handle error response
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      // Handle network errors or other errors
    }
  }

  const fetchAllCartItem = async () => {
    const userId = await fetchUserId();
    if (!userId) {
      // console.error('userId is not present');
      return; // Exit the function if userId is not present
    }

    try {
      const response = await fetch(`${IP_ADDRESS}/user/allcart/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch All Cart Item');
      }
      const jsonData = await response.json();
      // console.log(jsonData)
      setAllCartItem(jsonData)
    } catch (error) {
      console.error('Error fetching All cart Item:', error);
    }
  }





  const deleteCartItem = async (cartItemId) => {

    const userId = await fetchUserId();
    try {
      // Assuming your API endpoint for deleting an address is '/api/addresses/:id'
      const response = await fetch(`${IP_ADDRESS}/user/deleteitem/${userId}/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',

        },
      });

      if (response.ok) {
        // Address deleted successfully
        // console.log('Cart Item Delte Successfully');

        await fetchAllCartItem()
        // You may return some data if needed
        return true;
      } else {
        // Handle error response
        console.error('Failed to delete Cart Item:', response.statusText);
        return false;
      }
    } catch (error) {
      // Handle network errors
      console.error('Error deleting address:', error);
      return false;
    }
  };



  const fetchTotalPrice = async (itemPrice) => {
    let commissionCharge;
    let eighteenPercentCharge;

    if (itemPrice <= 1000) {
      commissionCharge = 1000 * 0.10;
      eighteenPercentCharge = Math.round(commissionCharge * 0.18) + 50;
    } else if (itemPrice > 1000 && itemPrice <= 2000) {
      commissionCharge = 2000 * 0.15;
      eighteenPercentCharge = Math.round(commissionCharge * 0.18) + 50;
    }
    else if (itemPrice > 2000 && itemPrice <= 3000) {
      commissionCharge = 3000 * 0.20;
      eighteenPercentCharge = Math.round(commissionCharge * 0.18) + 50;
    }
    else if (itemPrice > 3000) {
      commissionCharge = itemPrice * 0.20;
      eighteenPercentCharge = Math.round(commissionCharge * 0.18) + 100;
    }

    setgstAndOther(eighteenPercentCharge)
    setTotalCartPrice(itemPrice)
  }

  const fetchCartItemNumber = async () => {
    const userId = await fetchUserId();
    if (!userId) {
      // console.error('userId is not present');
      return; // Exit the function if userId is not present
    }

    try {
      const response = await fetch(`${IP_ADDRESS}/user/cart/count/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch All Cart Item');
      }
      const jsonData = await response.json();
      // console.log(jsonData)
      setCartItemNumber(jsonData)
    } catch (error) {
      console.error('Error fetching All cart Item:', error);
    }

  }


  const fetchPriceWithSlot = (slotFee) => {
    setTotalPriceWithSlot(totalCartPrice + slotFee + gstAndOther)
  }



  // Order Api Integration

  const [allOrderedCart, setAllOrderedCart] = useState();
  const [orderTimeSlot, setOrderTimeSlot] = useState();
  const [serviceDate, setServiceDate] = useState()
  const [paymentMethod, setPaymentMethod] = useState();
  const [bookingAddress, setBookingAddress] = useState()

  const addToOrderedCart = (product) => {
    // setAllOrderedCart((prevCart) => [...prevCart, product]);
    setAllOrderedCart(product)
  };

  const addOrderTimeSlot = (timeSlot) => {
    setOrderTimeSlot(timeSlot)
  }
  const addPaymentMethod = (option) => {
    setPaymentMethod(option);

  }

  const addBookingAddress = (id) => {
    // console.log(id)
    setBookingAddress(id)
  }

  const addServiceDate = (date) => {
    setServiceDate(date)
  }


  async function deleteAllCartItem() {
    const userId = await fetchUserId();
    if (!userId) {

      return; // Exit the function if userId is not present
    }
    try {
      const response = await fetch(`${IP_ADDRESS}/user/deleteallitem/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers as needed
        },
        // Add body if needed
      });

      if (!response.ok) {
        throw new Error('Failed to delete data'); // Handle non-successful response
      }

      console.log('Data deleted successfully');
      fetchCartItemNumber()

    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }




  const orderBook = async () => {

    const userId = await fetchUserId();
    if (!userId) {

      return; // Exit the function if userId is not present
    }

    try {
      const formData = {
        allOrderedCart: allOrderedCart,
        orderTimeSlot: orderTimeSlot,
        paymentMethod: paymentMethod,
        bookingAddress: bookingAddress,
        allCartItem: allCartItem,
        totalCartPrice: totalCartPrice,
        totalPriceWithSlot: totalPriceWithSlot,
        orderTime: currentTimeIST,
        orderDate: currentDateIST,
        serviceDate: serviceDate,
        status: ''
      }
      // console.log(formData)

      const response = await fetch(`${IP_ADDRESS}/user/create_orders/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Add any other headers as needed
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // console.log('Data saved successfully:', data);
      // console.log(data.data._id);

      const newData = await fetchBookingData(data.data)
      
      sendOrderMessageAdmin(newData)
      sendWhatsappConfirmation(newData)
      // console.log(newData)
      await deleteAllCartItem()
      fetchAllOrder();
      fetchAllCartItem()

    } catch (error) {
      console.error('Error saving data to database:', error);
    }

  }


  const fetchBookingData = async (bookingData) => {
    try {
      const responseUser = await fetch(`${IP_ADDRESS}/user/profiledetail/${bookingData.user}`);
      if (!responseUser.ok) {
        throw new Error('Failed to fetch details from User API');
      }
      const userDetail = await responseUser.json();

      const responseAddress = await fetch(`${IP_ADDRESS}/user/address/${bookingData.bookingAddress}`);
      if (!responseAddress.ok) {
        throw new Error('Failed to fetch details of address');
      }
      const addressDetail = await responseAddress.json();

      return {
        ...bookingData,
        userDetail: userDetail,
        addressDetail: addressDetail
      };
    } catch (error) {
      console.log("Error fetching booking detail", error);
      return bookingData;
    }
  };


  async function fetchMobileNumber() {
    try {
      const response = await fetch(`${IP_ADDRESS}/admin/whatsappreciever`);
      const data = await response.json();
      return data.mobileNumber;
    } catch (error) {
      console.error('Error fetching mobile number:', error);
      throw error;
    }
  }




  const sendOrderMessageAdmin = async (newData) => {
    const adminMobileNumbers = await fetchMobileNumber(); // List of admin mobile numbers


    for (const mobileNumber of adminMobileNumbers) {
      const Name = newData.userDetail.userName;
      const Address = `${newData.addressDetail.addressLine1}, ${newData.addressDetail.addressLine2}, ${newData.addressDetail.city}, ${newData.addressDetail.state}, ${newData.addressDetail.pincode}`;
      const totalAmount = `₹${newData.totalPriceWithSlot}`;
      const timeSlot = `${newData.orderTimeSlot}, ${newData.serviceDate}`;
      const customerPhone = newData.userDetail.phone;
      const serviceDetail = newData.allOrderedCart.map(item => `${item.productName} - ${item.quantity}`).join('\n');

      const options = {
        method: 'POST',
        headers: {
          'content-type': 'application/json-patch+json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMDRjNDIzMS00ZGE2LTRhNjctYTk3Yy01NTcyMTg0YjJhYzciLCJ1bmlxdWVfbmFtZSI6ImluZm9AbWV0cm9saXRlc29sdXRpb25zLmNvbSIsIm5hbWVpZCI6ImluZm9AbWV0cm9saXRlc29sdXRpb25zLmNvbSIsImVtYWlsIjoiaW5mb0BtZXRyb2xpdGVzb2x1dGlvbnMuY29tIiwiYXV0aF90aW1lIjoiMDYvMDQvMjAyNCAxMToxNzo0MiIsImRiX25hbWUiOiJtdC1wcm9kLVRlbmFudHMiLCJ0ZW5hbnRfaWQiOiIxMDA5NzEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBRE1JTklTVFJBVE9SIiwiZXhwIjoyNTM0MDIzMDA4MDAsImlzcyI6IkNsYXJlX0FJIiwiYXVkIjoiQ2xhcmVfQUkifQ.6mt_i42nDz5adKlXAhWRIV4fn866ZxxBbY8zIKhd4yI'
        },
        body: JSON.stringify({
          receivers: [
            {
              whatsappNumber: mobileNumber,
              customParams: [
                { name: 'name', value: Name },
                { name: 'address', value: Address },
                { name: 'total_cart_price', value: totalAmount },
                { name: 'service_time', value: timeSlot },
                { name: 'service_detail', value: serviceDetail },
                { name: 'customer_phone', value: customerPhone }
              ]
            }
          ],
          template_name: 'homeservice_admin',
          broadcast_name: 'homeservice_admin'
        })
      };

      try {
        const response = await fetch('https://live-mt-server.wati.io/100971/api/v2/sendTemplateMessages', options);
        const data = await response.json();
        // console.log('Response Data:', data);
      } catch (error) {
        console.error('Fetch Error:', error);
      }
    }
  };



  const sendWhatsappConfirmation = async (newData) => {
    

    const Name = newData.userDetail.userName.split(' ')[0];
    const Address = `${newData.addressDetail.addressLine1}, ${newData.addressDetail.addressLine2}, ${newData.addressDetail.city}, ${newData.addressDetail.state}, ${newData.addressDetail.pincode}`;
    const totalAmount = `₹${newData.totalPriceWithSlot}`;
    const timeSlot = `${newData.orderTimeSlot}, ${newData.serviceDate}`;
    const customerPhone = `91${newData.userDetail.phone}`;
    const totalQuantity = newData.allOrderedCart.reduce((acc, item) => acc + item.quantity, 0);
    const serviceDetail = newData.allOrderedCart.map(item => `${item.productName} - ${item.quantity}`).join('\n');
    const paymentMethod = newData.paymentMethod;
    const orderId = `#${newData._id.slice(-5)}`

    // console.log(Name, Address, totalAmount, timeSlot, customerPhone, totalQuantity, serviceDetail, paymentMethod, orderId)
    const url = `https://live-mt-server.wati.io/100971/api/v1/sendTemplateMessage?whatsappNumber=${customerPhone}`;
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMDRjNDIzMS00ZGE2LTRhNjctYTk3Yy01NTcyMTg0YjJhYzciLCJ1bmlxdWVfbmFtZSI6ImluZm9AbWV0cm9saXRlc29sdXRpb25zLmNvbSIsIm5hbWVpZCI6ImluZm9AbWV0cm9saXRlc29sdXRpb25zLmNvbSIsImVtYWlsIjoiaW5mb0BtZXRyb2xpdGVzb2x1dGlvbnMuY29tIiwiYXV0aF90aW1lIjoiMDYvMDQvMjAyNCAxMToxNzo0MiIsImRiX25hbWUiOiJtdC1wcm9kLVRlbmFudHMiLCJ0ZW5hbnRfaWQiOiIxMDA5NzEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBRE1JTklTVFJBVE9SIiwiZXhwIjoyNTM0MDIzMDA4MDAsImlzcyI6IkNsYXJlX0FJIiwiYXVkIjoiQ2xhcmVfQUkifQ.6mt_i42nDz5adKlXAhWRIV4fn866ZxxBbY8zIKhd4yI'
      },
      body: JSON.stringify({
        parameters: [
          { name: "name", value: Name },
          { name: "order_id", value: orderId },
          { name: "booking_item", value: serviceDetail },
          { name: "amount", value: totalAmount},
          { name: "booking_time", value: timeSlot },
          { name: "payment_option", value: paymentMethod},
          { name: "quantity", value: totalQuantity}
        ],
        template_name: "booking_confirmation_service",
        broadcast_name: "booking_confirmation_service"
      })
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      // console.log(data);
    } catch (error) {
      console.error('error:', error);
    }
  };










  const [allBookedOrders, setAllBookedOrders] = useState([])


  const fetchAllOrder = async () => {
    const userId = await fetchUserId();
    if (!userId) {
      // console.error('userId is not present');
      return; // Exit the function if userId is not present
    }

    // console.log(userId)

    try {
      const response = await fetch(`${IP_ADDRESS}/user/${userId}/getorders`);
      if (!response.ok) {
        throw new Error('Failed to fetch All Booked Orders');
      }
      const jsonData = await response.json();
      // console.log(jsonData)
      setAllBookedOrders(jsonData.reverse())
    } catch (error) {
      console.error('Error fetching All Booked Item:', error);
    }

  }



  // SubCategory Banner
  async function getRootParentId(categoryId) {
    try {
      const response = await fetch(`${IP_ADDRESS}/categories/${categoryId}/root-parent`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error fetching root parent ID');
      }

      const data = await response.json();
      return data.rootParentId;
    } catch (error) {
      console.error('Failed to fetch root parent ID:', error);
      throw error; // re-throw the error after logging it
    }
  }


  useEffect(() => {
    fetchAllSubCategoryBanners()
  }, [])


  const [allSubCateBanner, setAllSubCatBanner] = useState([])

  const fetchAllSubCategoryBanners = async () => {
    try {
      const response = await fetch(`${IP_ADDRESS}/subCategoryBanners`);
      if (!response.ok) {
        throw new Error('Error fetching subcategory banners');
      }

      const data = await response.json();
      // console.log('Fetched subcategory banners:', data);
      setAllSubCatBanner(data)
      return data;
    } catch (error) {
      console.error('Error fetching subcategory banners:', error);
      return [];
    }
  };



  // Sub Category Pricess 

  const [subcategoryPrices, setSubcategoryPrices] = useState([]);


  const fetchSubCategoryPrices = async (categoryId) => {
    try {
      const response = await fetch(`${IP_ADDRESS}/min-price/${categoryId}`); // Replace '/your-api-endpoint' with the actual endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSubcategoryPrices(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };




  const fetchLatestVersion = async () => {
    try {
      const response = await fetch(`${IP_ADDRESS}/app/latestversion`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.latestVersion;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return null;
    }
  };




  // Multi use Function
  function calculateDiscountedPrice(price, discountPercentage) {
    // Convert the discount percentage to a decimal value
    const discount = discountPercentage / 100;

    // Calculate the discounted amount
    const discountedAmount = price * discount;

    // Subtract the discounted amount from the original price to get the discounted price
    const discountedPrice = Math.floor(price - discountedAmount);

    // Return the discounted price
    return discountedPrice;
  }












  return (
    <DataContext.Provider value={{
      slider, service, fetchSubServices, subServices, fetchServiceById, parentCategory, allProducts, fakedata, IP_ADDRESS, fetchProductDetail, productDetail,

      createUserProfile,
      userDetail,
      logOut,
      userProfileImage,
      fetchUserId,
      addAddress,
      fetchUserAddress,
      userAddress,
      deleteAddress,
      fetchAddressDetail,
      addressDetail,
      modifyAddress,
      addToCart,
      allCartItem,
      fetchAllCartItem,
      safetyFee,
      deleteCartItem,


      fetchTotalPrice,
      totalCartPrice,
      fetchCartItemNumber,
      cartItemNumber,

      fetchPriceWithSlot,
      totalPriceWithSlot,


      allOrderedCart,
      addToOrderedCart,
      addOrderTimeSlot,
      orderTimeSlot,
      addPaymentMethod,
      paymentMethod,
      addBookingAddress,
      bookingAddress,
      orderBook,
      addServiceDate,
      gstAndOther,

      allBookedOrders,
      fetchAllOrder,

      calculateDiscountedPrice,



      getRootParentId,
      allSubCateBanner,
      fetchAllSubCategoryBanners,


      fetchSubCategoryPrices,
      subcategoryPrices,


      fetchLatestVersion

    }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataContextProvider };
