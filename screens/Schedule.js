import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DataContext } from '../Data/DataContext';

const Schedule = ({ navigation }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState('');
    const [normalAvailableSlot, setnormalAvailableSlot] = useState([])
    const [primeAvailableSlot, setPrimeAvailableSlot] = useState([])
    const [selectedSlot, setSelectedSlot] = useState('')
    const [isLoading, setIsLoading] = useState(true);

    const {totalCartPrice, fetchPriceWithSlot, totalPriceWithSlot, addOrderTimeSlot,  addServiceDate} = useContext(DataContext)

    const normalSlotTimming = ['9:00 AM - 9:30 AM',

        '10:00 AM - 10:30 AM',
        '11:00 AM - 11:30 AM',
        '12:00 PM - 12:30 PM',
        '1:00 PM - 1:30 PM',
        '2:00 PM - 2:30 PM',
        '3:00 PM - 3:30 PM',
        '4:00 PM - 4:30 PM',
        '5:00 PM - 5:30 PM',
        '6:00 PM - 6:30 PM',
        '7:00 PM - 7:30 PM',
    ]

    const primeSlotTimming = [
        '7:00 AM - 7:30 AM',
        '8:00 AM - 8:30 AM',
        '8:00 PM - 8:30 PM',
        '8:30 PM - 9:00 PM',

    ]



    // Function to format time in 12-hour format
    const formatTime = (date) => {
        // Extract hours, minutes, and seconds
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        // Convert hours to 12-hour format
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0 hours)

        // Return the formatted time string
        return `${hours}:${minutes} ${ampm}`;
    };

    // Function to update current time
    const updateTime = () => {
        const now = new Date();
        const formattedTime = formatTime(now);
        setCurrentTime(formattedTime);
    };



    const getCurrentDateAndDay = () => {
        const dateObj = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return dateObj.toLocaleDateString(undefined, options);
    };

    // Function to get the dates for the current year
    const getYearDates = () => {
        // Get current UTC time
        const nowUTC = new Date();

        // Indian Standard Time (IST) offset is UTC+5:30
        const ISTOffset = 5.5 * 60 * 60 * 1000; // in milliseconds


        const nowIST = new Date(nowUTC.getTime() + ISTOffset);



        const startOfYear = new Date(nowIST.getFullYear(), 0, 1);

        const dates = [];
        let currentDate = new Date(nowIST);

        for (let i = 0; i < 30; i++) {

            const currentDateToPush = new Date(currentDate);

            dates.push(currentDateToPush);

            // Increase the current date by one day
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };
    const [currentDateAndDay, setCurrentDateAndDay] = useState(getCurrentDateAndDay());
    const [yearDates, setYearDates] = useState(getYearDates());

    useEffect(() => {
        // Update the current date and day every time the component mounts
        setCurrentDateAndDay(getCurrentDateAndDay());
        // Update the year dates every time the component mounts
        setYearDates(getYearDates());
        handleDatePress(0);
        fetchPriceWithSlot(0)
        setIsLoading(false);


    }, []);


    useEffect(() => {
        const timerID = setInterval(updateTime, 1000);

        return () => clearInterval(timerID);
    }, [])

    useEffect(() => {
        handleSlot();
    }, [activeIndex]);

    const handleDatePress = (index) => {
        setActiveIndex(index);
        const activeDate = yearDates[index];
        const formattedDate = activeDate.toLocaleDateString('en-GB'); // Convert to dd/mm/yyyy format
    // console.log("Selected Date:", formattedDate);
        handleSlot();
        addServiceDate(formattedDate)

    };





    const extractTimeFromSlot = (slotText) => {
        const hyphenIndex = slotText.indexOf('-');
        if (hyphenIndex !== -1) {

            return slotText.substring(0, hyphenIndex).trim();
        } else {

            return slotText;
        }
    };




    const handleSlot = () => {
        const now = new Date();
        const selectedDate = yearDates[activeIndex];
        // console.log(selectedDate)
        const isToday = selectedDate.toDateString() === now.toDateString();

        if (isToday) {
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const currentTime = hours * 60 + minutes; // Convert current time to minutes

            const updatednormalAvailableSlot = [];
            const updatePrimeAvailableSlot = [];

            normalSlotTimming.forEach((time) => {
                // Extract slot time from the given time string
                const slotTime = extractTimeFromSlot(time);

                // Convert slot time to minutes
                let slotHours = parseInt(slotTime.split(':')[0]);
                let slotMinutes = parseInt(slotTime.split(':')[1].split(' ')[0]);
                let slotAmPm = slotTime.split(' ')[1];
                if (slotAmPm === 'PM' && slotHours !== 12) {
                    slotHours += 12;
                } else if (slotAmPm === 'AM' && slotHours === 12) {
                    slotHours = 0;
                }
                const slotTimeInMinutes = slotHours * 60 + slotMinutes;

                // Calculate the difference in minutes
                const differenceInMinutes = slotTimeInMinutes - currentTime;

                // Check if the difference is greater than 2 hours
                if (differenceInMinutes > 120) {
                    updatednormalAvailableSlot.push(time);
                }
            });
            primeSlotTimming.forEach((time) => {
                // Extract slot time from the given time string
                const slotTime = extractTimeFromSlot(time);

                // Convert slot time to minutes
                let slotHours = parseInt(slotTime.split(':')[0]);
                let slotMinutes = parseInt(slotTime.split(':')[1].split(' ')[0]);
                let slotAmPm = slotTime.split(' ')[1];
                if (slotAmPm === 'PM' && slotHours !== 12) {
                    slotHours += 12;
                } else if (slotAmPm === 'AM' && slotHours === 12) {
                    slotHours = 0;
                }
                const slotTimeInMinutes = slotHours * 60 + slotMinutes;

                // Calculate the difference in minutes
                const differenceInMinutes = slotTimeInMinutes - currentTime;

                // Check if the difference is greater than 2 hours
                if (differenceInMinutes > 120) {
                    updatePrimeAvailableSlot.push(time);
                }
            });

            // Update the available slots state
            setnormalAvailableSlot(updatednormalAvailableSlot);
            setPrimeAvailableSlot(updatePrimeAvailableSlot);
        } else {

            setnormalAvailableSlot(normalSlotTimming);
            setPrimeAvailableSlot(primeSlotTimming);
        }
    };
    const handleSelectSlot = (time) => {
        // console.log(time)
        setSelectedSlot(time);
        const isPrimeSlot = primeAvailableSlot.includes(time);
        if (isPrimeSlot) {
            fetchPriceWithSlot(150)
        }
        else{
            fetchPriceWithSlot(0)
        }

    }

    const handleReviewAndPay = () => {
        if (!selectedSlot) {
            // Show alert if no slot is selected
            Alert.alert('Please select a slot');
        } else {
            // console.log(selectedSlot);
            addOrderTimeSlot(selectedSlot)
            
            // Navigate to Payment Summary screen if slot is selected
            navigation.navigate('Payment Summary');
        }

        
        
    }


    return (
        <View style={styles.main}>
            {/* <Text>{currentTime}</Text> */}

            {isLoading ? (
                <ActivityIndicator size="large" color="#000" style={styles.loader} />
            ) : (
                <>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
                    <Ionicons name='arrow-back' color='#000' size={30} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Schedule</Text>
            </View>

            {/* Calendar */}
            

            <View style={styles.calendarBox}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {yearDates.map((date, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={1}
                            style={[
                                styles.dateContainer,
                                index === activeIndex ? styles.dateConatinerActive : null,
                            ]}
                            onPress={() => handleDatePress(index)}
                        >
                            <Text style={[
                                styles.dayText,
                                index === activeIndex ? styles.dayTextActive : null,
                            ]}>{date.toLocaleDateString('en-US', { month: 'short' })}</Text>
                            <Text style={[
                                styles.dateText,
                                index === activeIndex ? styles.dateTextActive : null,
                            ]}>{date.getDate()}</Text>


                            <Text style={[
                                styles.dayText,
                                index === activeIndex ? styles.dayTextActive : null,
                            ]}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>



            {/* Time Sloats */}

            <ScrollView style={styles.allContent} showsVerticalScrollIndicator={false}>
                {/* Prime SLot Conatainer */}

                <View style={styles.slotsContainer}>
                    <Text style={styles.slotHeading}>Prime Slot</Text>

                    <View style={styles.slotsBox}>

                        {primeAvailableSlot.map((time, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={1}
                                style={[styles.slot, selectedSlot === time ? styles.slotSelected : null]}
                                onPress={() => handleSelectSlot(time)}
                            >
                                <View style={styles.extraAmountBox}>
                                    <Text>+ ₹150</Text>
                                </View>
                                <Text style={[styles.slotText, selectedSlot === time ? styles.slotSelectedText : null]}>{time}</Text>
                            </TouchableOpacity>
                        ))}

                    </View>
                </View>



                <View style={styles.slotsContainer}>
                    <Text style={styles.slotHeading}>Normal Slot</Text>

                    <View style={styles.slotsBox}>
                        {normalAvailableSlot.length > 0 ? (
                            normalAvailableSlot.map((time, index) => (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={1}
                                    style={[styles.slot, selectedSlot === time ? styles.slotSelected : null]}
                                    onPress={() => handleSelectSlot(time)}
                                >
                                    <Text style={[styles.slotText, selectedSlot === time ? styles.slotSelectedText : null]}>{time}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text>No Slot Available </Text>
                        )}
                    </View>
                </View>




            </ScrollView>


            <View style={styles.slotBox}>
          <TouchableOpacity style={styles.amountBox}>
            <Text style={styles.amountText}>₹ {totalCartPrice}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.slotBtn} onPress={handleReviewAndPay}>
            <Text style={styles.slotBtnText}>Review and Pay</Text>
          </TouchableOpacity>
        </View>
        </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        marginTop: 10,
        // padding: 20,
        // paddingLeft: 10,
        // paddingRight: 10,
        paddingBottom:0,
        flex: 1
    },
    headerText: {
        textAlign: 'center',
        fontSize: 18,
        marginLeft: 40,
    },
    header: {
        flexDirection: 'row',
        height: 60,
        paddingBottom: 10,
        alignItems: 'center',
        padding:20
        // borderWidth:2
    },
    calendarBox: {
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        height: 100,
        margin:10
    },
    dateContainer: {
        // paddingHorizontal: 10,
        alignItems: 'center',
        // borderWidth:2,
        justifyContent: 'center',
        marginRight: 10,
        width: 70
        // paddingVertical:10
    },

    dateConatinerActive: {
        backgroundColor: '#00456e',
        borderRadius: 10

    },

    dateText: {
        fontSize: 20,
        fontWeight: 'bold',

    },

    dayTextActive: {
        color: '#fff'
    },

    dateTextActive: {
        color: '#fff'
    },
    dayText: {
        fontSize: 14,
        // fontWeight: 'bold',


    },
    allContent: {
        // borderWidth:2,
        flex: 1
    },

    slotsContainer: {
        marginTop: 20,

    },

    slotHeading: {
        // textAlign:'center',
        marginLeft: 10,
        fontWeight: '700',
        fontSize: 20,
        marginBottom: 20
    },

    slotsBox: {
        margin: 10,
        // borderWidth:2,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },

    slot: {
        // backgroundColor:'#BDBDBD',
        borderWidth: 1,
        borderColor: '#BDBDBD',
        width: '45%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 10
    },

    slotText: {

    },
    slotSelectedText: {
        color: '#fff'
    },

    slotSelected: {
        backgroundColor: '#00456e',
        borderWidth: 0
    },

    extraAmountBox: {
        position: 'absolute',
        top: -10,
        right: 10,
        backgroundColor: '#FEF5E6',
        borderColor: '#D5B88D',
        borderWidth: 0.5,
        paddingHorizontal: 5,
        borderRadius: 2.5
    },
    slotBox: {
        // paddingHorizontal:10,
        flexDirection: 'row'
      },
      amountBox: {
        width: '50%',
        backgroundColor: '#E8EBEE',
        padding: 15,
        // borderWidth:2,
        justifyContent: 'center',
        alignItems: 'center'
      },
    
      amountText: {
        fontSize: 16,
        fontWeight: '700',
      },
    
      slotBtn: {
        backgroundColor: '#007500',
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center'
      },
    
      slotBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
      }

});

export default Schedule;
