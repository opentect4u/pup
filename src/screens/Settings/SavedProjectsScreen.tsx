import React, { useState, useEffect, useCallback } from 'react'
import { View, ScrollView, Image, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native'
import { Text } from "react-native-paper"
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { projectStorage } from '../../storage/appStorage'
import Header from "../../components/Header"
import ButtonPaper from "../../components/ButtonPaper"
import { usePaperColorScheme } from '../../theme/theme'

const SavedProjectsScreen = () => {
    const theme = usePaperColorScheme()
    const [projects, setProjects] = useState([]);
    const navigation = useNavigation();

    const fetchProjects = useCallback(async () => {
        try {
            const projectsData = await projectStorage.getString("projects");
            if (projectsData) {
                const parsedProjects = JSON.parse(projectsData);
                setProjects(parsedProjects);
            } else {
                setProjects([]);
            }
        } catch (error) {
            console.log("Error fetching projects:", error);
            ToastAndroid.show("Error fetching saved projects.", ToastAndroid.SHORT);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView keyboardShouldPersistTaps='handled' style={{ backgroundColor: theme.colors.background }}>
                <Header />
                <View style={{ padding: 30, gap: 5, flex: 1 }}>
                    <Text variant='titleLarge'>Saved Projects</Text>
                    {projects.length === 0 ? (
                        <Text variant='titleMedium'>No saved projects found.</Text>
                    ) : (
                        projects.map((project: any, index) => (
                            <View key={index} style={styles.projectContainer}>
                                <Text variant='bodyMedium'>Project ID: {project.projectId}</Text>
                                <Text variant='bodyMedium'>Progress: {project.progress}</Text>
                                <ScrollView horizontal style={styles.imagesContainer}>
                                    {project["progress_pic[]"].map((uri: any, idx: number) => (
                                        <Image key={idx} source={{ uri }} style={styles.image} resizeMode="contain" />
                                    ))}
                                </ScrollView>
                            </View>
                        ))
                    )}

                    <ButtonPaper icon={"refresh"} mode='contained' onPress={fetchProjects} style={{
                        paddingVertical: 8,
                    }}>Refresh</ButtonPaper>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SavedProjectsScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 20
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginVertical: 20,
    },
    projectContainer: {
        marginBottom: 30,
        borderBottomWidth: 0.5,
        borderStyle: "dashed",
        borderColor: '#888',
        paddingBottom: 10
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    projectProgress: {
        fontSize: 16,
        marginVertical: 5
    },
    imagesContainer: {
        flexDirection: 'row',
        marginVertical: 10
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
    },
    refreshButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20
    },
    refreshButtonText: {
        color: '#fff',
        fontSize: 16
    }
});
