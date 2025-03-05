import React, { useState, useEffect, useCallback } from 'react'
import { View, ScrollView, Image, StyleSheet, ToastAndroid, Linking } from 'react-native'
import { Divider, Text, TouchableRipple } from "react-native-paper"
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { projectStorage } from '../../storage/appStorage'
import Header from "../../components/Header"
import ButtonPaper from "../../components/ButtonPaper"
import { usePaperColorScheme } from '../../theme/theme'
import { ProjectStoreModel } from '../../models/global_models'
import FileViewer from 'react-native-file-viewer'

const SavedProjectsScreen = () => {
    const theme = usePaperColorScheme()
    const [projects, setProjects] = useState<ProjectStoreModel[]>([])
    const navigation = useNavigation()

    const fetchProjects = useCallback(async () => {
        try {
            const projectsData = await projectStorage.getString("projects")
            if (projectsData) {
                const parsedProjects = JSON.parse(projectsData)
                setProjects(parsedProjects)
            } else {
                setProjects([])
            }
        } catch (error) {
            console.log("Error fetching projects:", error)
            ToastAndroid.show("Error fetching saved projects.", ToastAndroid.SHORT)
        }
    }, []);

    useEffect(() => {
        fetchProjects()
    }, [fetchProjects])

    const handleImagePress = async (uri: string) => {
        try {
            await FileViewer.open(uri, { showOpenWithDialog: true })
        } catch (error) {
            console.log("Error opening image with FileViewer:", error)
            ToastAndroid.show("Error opening image.", ToastAndroid.SHORT)
        }
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView keyboardShouldPersistTaps='handled' style={{ backgroundColor: theme.colors.background }}>
                <Header />
                <View style={{ padding: 30, gap: 5, flex: 1 }}>
                    <Text variant='headlineLarge' style={{
                        paddingBottom: 5,
                        color: theme.colors.secondary
                    }}>Saved Projects</Text>
                    {projects.length === 0 ? (
                        <Text variant='titleMedium'>No saved projects found.</Text>
                    ) : (
                        projects.map((project, index) => (
                            <View key={index} style={styles.projectContainer}>
                                <Text variant='bodyLarge'>Project ID: {project.projectId}</Text>
                                <Divider style={{
                                    marginVertical: 5
                                }} />
                                <Text variant='bodyMedium'>Progress: {project.progress}</Text>
                                <Text variant='bodyMedium'>Latitude: {project.lat}</Text>
                                <Text variant='bodyMedium'>Longitude: {project.lng}</Text>
                                <ScrollView horizontal style={styles.imagesContainer}>
                                    {project["progress_pic[]"].map((uri: string, idx: number) => (
                                        <TouchableRipple key={idx} onPress={() => handleImagePress(uri)}>
                                            <Image key={idx} source={{ uri }} style={styles.image} resizeMode="contain" />
                                        </TouchableRipple>
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
    projectContainer: {
        marginBottom: 30,
        borderWidth: 0.8,
        padding: 20,
        borderStyle: "dashed",
        borderColor: '#888',
        borderRadius: 20,
        // paddingBottom: 10
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
});
