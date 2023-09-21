import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    ScrollView,
    StyleSheet,
    FlatList,
    Image,
} from 'react-native';
import axios from 'axios';

const BASE_URL = 'https://cognisite-lot4.onrender.com/sch/'; 

const App = () => {
    const [activityName, setActivityName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [progress, setProgress] = useState(0);
    const [comments, setComments] = useState('');
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [currentStep, setCurrentStep] = useState('loading');
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [itemId, setItemId] = useState('')


    const filterAndSetActivities = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/schedules/filter`, {
                startDate,
                endDate,
            });

            setFilteredActivities(response.data);
            setCurrentStep('filteredData'); 
        } catch (error) {
            console.error('Error filtering activities:', error);
            Alert.alert('Error', 'Failed to filter activities');
        }
    };

    const updateActivity = async () => {
        // console.log(photoURL,progress)
        try {
            const id = itemId
            console.log('a', id)
            await axios.put(`${BASE_URL}/update/${id}`, {
                progress,
                photoURL,
                comments,
            });

            setPhotoURL('');
            setProgress(0);
            setComments('');
            fetchActivities();

            Alert.alert('Success', 'Activity updated successfully');
        } catch (error) {
            console.error('Error updating activity:', error);
            Alert.alert('Error', 'Failed to update activity');
        }
    };

    const fetchActivities = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/`);
            setActivities(response.data.activities);
            setCurrentStep('data'); 
        } catch (error) {
            console.error('Error fetching activities:', error);
            Alert.alert('Error', 'Failed to fetch activities');
        }
    };

    useEffect(() => {
        fetchActivities(); 
    }, []);

    const addActivity = async () => {
        try {
            await axios.post(`${BASE_URL}/schedules`, {
                activityName,
                startDate,
                endDate,
                description,
                assignedTo,
                photoURL,
                progress,
                comments: comments.split('\n'),
            });

            setActivityName('');
            setStartDate('');
            setEndDate('');
            setDescription('');
            setAssignedTo('');
            setPhotoURL('');
            setProgress(0);
            setComments('');

            Alert.alert('Success', 'Activity added successfully');
            fetchActivities(); 
        } catch (error) {
            console.error('Error adding activity:', error);
            Alert.alert('Error', 'Failed to add activity');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Activity Management</Text>

            {currentStep === 'loading' && <Text>Loading...</Text>}

            {currentStep === 'form' && (
                <View>
                    <Text style={styles.subheading}>Add Activity</Text>
                    <View style={styles.rowContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Activity Name:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Activity Name"
                                value={activityName || ''} 
                                onChangeText={setActivityName}
                            />

                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Start Date (YYYY-MM-DD):</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Start Date"
                                value={startDate}
                                onChangeText={setStartDate}
                            />
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>End Date (YYYY-MM-DD):</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="End Date"
                                value={endDate}
                                onChangeText={setEndDate}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Description:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Description"
                                value={description}
                                onChangeText={setDescription}
                            />
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Assigned To:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Assigned To"
                                value={assignedTo}
                                onChangeText={setAssignedTo}
                            />
                        </View>
                    </View>
                    <Button title="Add Activity" onPress={addActivity} />
                    <Button title="Show Assignment" onPress={fetchActivities} />
                    <Button title="Show Filters" onPress={() => setCurrentStep('filters')} />
                </View>
            )}

            {currentStep === 'filters' && (
                <View>
                    <Text style={styles.subheading}>Filter Activities</Text>
                   
                    <View style={styles.rowContainer}>
                        
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Start Date (YYYY-MM-DD):</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Start Date"
                                value={startDate}
                                onChangeText={setStartDate}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>End Date (YYYY-MM-DD):</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="End Date"
                                value={endDate}
                                onChangeText={setEndDate}
                            />
                        </View>
                    </View>
                    <Button title="Filter Result" onPress={filterAndSetActivities} />
                    <Button title="Show Assignment" onPress={fetchActivities} />
                    <Button title="Show Form" onPress={() => setCurrentStep('form')} />
                </View>
            )}

            {currentStep === 'data' && (
                <View>
                    <Button title="Show Filters" onPress={() => setCurrentStep('filters')} />
                    <Button title="Show Form" onPress={() => setCurrentStep('form')} />
                    <Text style={styles.subheading}>Activities</Text>
                    <FlatList
                        data={activities}
                        keyExtractor={(item) => item._id}
                        // numColumns={3}
                        contentContainerStyle={styles.gridContainer}
                        renderItem={({ item }) => (
                            <View style={styles.gridContainer}>
                                <View style={styles.gridItem}>
                                    <Text>Activity Name: {item.activityName}</Text>
                                    <Text>Start Date: {item.startDate}</Text>
                                    <Text>End Date: {item.endDate}</Text>
                                    <Text>Description: {item.description}</Text>
                                    <Text>Assigned To: {item.assignedTo}</Text>
                                    {item.photoURL && (
                                        <Image source={{ uri: item.photoURL }} style={{ width: '100%', height: 200 }} />
                                    )}
                                    <Text>Progress: {item.progress}%</Text>
                                    <Text>Comments:</Text>
                                    {item.comments.map((comment, index) => (
                                        <Text key={index}>{comment}</Text>
                                    ))}
                                    <Button
                                        title="Submit Assignment"
                                        onPress={() => {
                                            setSelectedSchedule(item);
                                            setPhotoURL(item.photoURL);
                                            setProgress(item.progress.toString());
                                            setComments(item.comments.join('\n'));
                                            setItemId(item._id);
                                            setCurrentStep('update');
                                            console.log(item._id)
                                        }}
                                    />
                                </View>
                            </View>
                        )}
                    />
                    
                </View>
            )}

            {currentStep === 'filteredData' && (
                <View>
                    <Text style={styles.subheading}>Filtered Activities</Text>
                    <FlatList
                        data={filteredActivities}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={styles.activityItem}>
                                <Text>Activity Name: {item.activityName}</Text>
                                <Text>Start Date: {item.startDate}</Text>
                                <Text>End Date: {item.endDate}</Text>
                                <Text>Description: {item.description}</Text>
                                <Text>Assigned To: {item.assignedTo}</Text>
                                {item.photoURL && (
                                    <Image source={{ uri: item.photoURL }} style={{ width: 200, height: 200 }} />
                                )}
                                <Text>Progress: {item.progress}%</Text>
                                <Text>Comments:</Text>
                                {item.comments.map((comment, index) => (
                                    <Text key={index}>{comment}</Text>
                                ))}
                                <Button
                                    title="Submit Assignment"
                                    onPress={() => {
                                        setSelectedSchedule(item);
                                        setPhotoURL(item.photoURL);
                                        setProgress(item.progress.toString());
                                        setComments(item.comments.join('\n'));
                                        setItemId(item._id);
                                        setCurrentStep('update');
                                        console.log(item._id)
                                    }}
                                />
                            </View>
                        )}
                    />

                    <Button title="Show Filters" onPress={() => setCurrentStep('filters')} />
                </View>
            )}

            {currentStep === 'update' && (
                <View>
                    <Text style={styles.subheading}>Update Activity</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Photo URL"
                        value={photoURL}
                        onChangeText={setPhotoURL}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Progress (%)"
                        value={progress.toString()}
                        onChangeText={(text) => {
                            const parsedProgress = parseInt(text, 10);
                            setProgress(isNaN(parsedProgress) ? 0 : parsedProgress);
                        }}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Comments (separate with newlines)"
                        value={comments}
                        onChangeText={setComments}
                        multiline
                    />
                    <Button title="Submit Update" onPress={updateActivity} />
                    {/* <Button title="Show Grid" onPress={() => setCurrentStep('grid')} /> */}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 20,
        marginBottom: 10,
    },
    subheading: {
        fontSize: 18,
        marginBottom: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputContainer: {
        flex: 1,
        marginRight: 10,
    },
    label: {
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
    },
    activityItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },


    gridContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: 5,
        gap:10,
    },
    gridItem: {
        width: '100%', 
        margin: 5, 
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        // marginHorizontal: 30,
        padding: 20,
    },
    gridItemImage: {
        width: '100%', 
        height: 'auto',
        // marginBottom: 10,
    },



    // Add more styles as needed
});


export default App;
