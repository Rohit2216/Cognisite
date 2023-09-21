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

const BASE_URL = 'http://localhost:8000/sch'; // Replace with your backend server URL

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
    const [currentStep, setCurrentStep] = useState('loading'); // Manage the current step
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    const filterAndSetActivities = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/schedules/filter`, {
                startDate,
                endDate,
            });

            setFilteredActivities(response.data);
            setCurrentStep('filteredData'); // Switch to the filtered data view
        } catch (error) {
            console.error('Error filtering activities:', error);
            Alert.alert('Error', 'Failed to filter activities');
        }
    };

    const updateActivity = async () => {
        try {
            await axios.put(`${BASE_URL}/update/${selectedSchedule._id}`, {
                progress: parseInt(progress),
                photoURL,
                comments: comments.split('\n'),
            });

            // Reset the form fields after successful update
            setPhotoURL('');
            setProgress(0);
            setComments('');

            // Fetch updated activities
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
            setCurrentStep('data'); // Switch to the data view
        } catch (error) {
            console.error('Error fetching activities:', error);
            Alert.alert('Error', 'Failed to fetch activities');
        }
    };

    useEffect(() => {
        fetchActivities(); // Fetch activities on initial load
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
            fetchActivities(); // Fetch activities after adding a new one
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
                                value={activityName || ''} // Set to an empty string if activityName is null
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
                    <Button title="Filter Activities" onPress={filterAndSetActivities} />
                    <Button title="Show Form" onPress={() => setCurrentStep('form')} />
                </View>
            )}

            {currentStep === 'data' && (
                <View>
                    <Text style={styles.subheading}>Activities</Text>
                    <FlatList
                        data={activities}
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
                                        setCurrentStep('update');
                                    }}
                                />
                            </View>
                        )}
                    />
                    <Button title="Show Form" onPress={() => setCurrentStep('form')} />
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
                    <Button title="Show Grid" onPress={() => setCurrentStep('grid')} />
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
});

export default App;
