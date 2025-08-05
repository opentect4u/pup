import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  ToastAndroid,
  Linking,
  Alert,
} from 'react-native';
import { ActivityIndicator, Divider, Text, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { loginToken, projectStorage } from '../../storage/appStorage';
import Header from '../../components/Header';
import ButtonPaper from '../../components/ButtonPaper';
import { usePaperColorScheme } from '../../theme/theme';
import { ProjectStoreModel } from '../../models/global_models';
import FileViewer from 'react-native-file-viewer';
import axios from 'axios';
import { ADDRESSES } from '../../config/api_list';

const SavedProjectsScreen = () => {
  const theme = usePaperColorScheme();
  const [projects, setProjects] = useState<ProjectStoreModel[]>([]);
  const navigation = useNavigation();
  const [loadingPro, setLoadingPro] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const loginTokenStore = useMemo(
          () => JSON.parse(loginToken?.getString('login-token') ?? '{}'),
          [],
      );

  const fetchProjects = async () => {
    Alert.alert('Fetching Projects', 'Please wait while we fetch your saved projects.');
    setLoadingPro(true)
    try {
      const projectsData_Date = await projectStorage.getString('projects_date');
      const parsedProjects_Date = JSON.parse(projectsData_Date ?? '');
      console.log(parsedProjects_Date, 'projects_date____');
      
      
      const projectsData = await projectStorage.getString('projects');
      if (projectsData) {
        const parsedProjects = JSON.parse(projectsData);
        console.log(parsedProjects, 'projects____', projects);
        // setTimeout(() => {
         
        // }, 2000);

        setProjects(parsedProjects); 
        setLoadingPro(false)
        
      } else {
        setProjects([]);
        setLoadingPro(false)
      }
    } catch (error) {
      console.log('Error fetching projects:', error);
      ToastAndroid.show('Error fetching saved projects.', ToastAndroid.SHORT);
      setLoadingPro(false)
    }
  };

  // useEffect(() => {
  //   fetchProjects();
  // }, [fetchProjects]);


    useEffect(() => {
        if(isFocused){
        fetchProjects();
        }
    }, [isFocused]);

  const handleImagePress = async (uri: string) => {
    try {
      await FileViewer.open(uri, { showOpenWithDialog: true });
    } catch (error) {
      console.log('Error opening image with FileViewer:', error);
      ToastAndroid.show('Error opening image.', ToastAndroid.SHORT);
    }
  };



  // const updateProjectLive = async () => {
  //   setLoading(true)
  //   console.log(projects, 'Response_________');
    
  //       await axios.post(`${ADDRESSES.PROJECT_OFFLINE_UPDATE}`, projects, {
  //                   headers: {
  //                       "Content-Type": "multipart/form-data",
  //                       // "auth_key": AUTH_KEY
  //                       'Authorization': `Bearer ` + loginTokenStore?.token
  //                   }
  //               }).then(res => {
  //                   console.log("Response_________", res)
  //                   setLoading(false)
                    
  //               }).catch(err => {
  //                   console.log("Response:", err)
  //                   console.log("Upload error:", err)
  //                   console.log("Response_________", err)
  //                   // setLoading(false)
  //               })
  //   };

// const updateProjectLive = async () => {
//   setLoading(true);
//   console.log(projects, 'Submitting Projects One by One');

//   for (let i = 0; i < projects.length; i++) {

    

//     const project = projects[i];
//     const formData = new FormData();

//     formData.append('approval_no', project.approval_no);
//     formData.append('progress_percent', project.progress_percent.toString());
//     formData.append('progressive_percent', project.progressive_percent.toString());
//     formData.append('lat', project.lat.toString());
//     formData.append('long', project.long.toString());
//     formData.append('address', project.address);
//     formData.append('actual_date_comp', project.actual_date_comp);
//     formData.append('remarks', project.remarks);
//     formData.append('created_by', project.created_by);

//     // Append images
//     const progressPics = project['progress_pic[]'] || project["progress_pic[]"] || [];
//     for (let j = 0; j < progressPics.length; j++) {
//       const uri = progressPics[j];

//       formData.append('progress_pic[]', {
//         uri,
//         name: uri.split('/').pop() || `image_${j}.jpg`,
//         type: 'image/jpeg',
//       });
//     }

//     console.log(formData, 'Response_________');

//     try {
//       const response = await axios.post(
//         `${ADDRESSES.PROJECT_PROGRESS_UPDATE}`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             'Authorization': `Bearer ${loginTokenStore?.token}`,
//           },
//         }
//       );

//       console.log(`✅ Uploaded project ${project.approval_no}`, response.data);
//       projectStorage.clearAll(); 
//       fetchProjects();
//     } catch (err) {
//       console.log(`❌ Failed to upload project ${project.approval_no}`, err);
//       // Optionally break or continue depending on needs
//     }
//   }

//   setLoading(false);
//   ToastAndroid.show('All projects processed.', ToastAndroid.SHORT);
// };

const updateProjectLive = async () => {
  setLoading(true);

  const stored = await projectStorage.getString('projects');
  let storedProjects: any[] = stored ? JSON.parse(stored) : [];

  const successfullyUploadedApprovalNos: string[] = [];

  for (let i = 0; i < storedProjects.length; i++) {
    const project = storedProjects[i];
    const formData = new FormData();

    formData.append('approval_no', project.approval_no);
    formData.append('progress_percent', project.progress_percent.toString());
    formData.append('progressive_percent', project.progressive_percent.toString());
    formData.append('lat', project.lat.toString());
    formData.append('long', project.long.toString());
    formData.append('address', project.address);
    formData.append('actual_date_comp', project.actual_date_comp);
    formData.append('remarks', project.remarks);
    formData.append('created_by', project.created_by);

    const progressPics = project['progress_pic[]'] || project.progress_pic || [];
    for (let j = 0; j < progressPics.length; j++) {
      const uri = progressPics[j];

      formData.append('progress_pic[]', {
        uri,
        name: uri.split('/').pop() || `image_${j}.jpg`,
        type: 'image/jpeg',
      });
    }

    try {
      const response = await axios.post(`${ADDRESSES.PROJECT_PROGRESS_UPDATE}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${loginTokenStore?.token}`,
        },
      });

      console.log(response, 'response_________////');
      

      console.log(`✅ Uploaded project ${project.approval_no}`);
      successfullyUploadedApprovalNos.push(project.approval_no);
    } catch (err) {
      console.log(`❌ Failed to upload project ${project.approval_no}`, err);
    }
  }

  // Remove successfully uploaded projects from localStorage
  const remainingProjects = storedProjects.filter(
    (project) => !successfullyUploadedApprovalNos.includes(project.approval_no)
  );

  

  // Clear all old 'projects' data from storage first
  await projectStorage.clearAll();
  fetchProjects();

  if (remainingProjects.length > 0) {
  console.log('Remaining projects after upload:', remainingProjects);
  await projectStorage.set('projects', JSON.stringify(remainingProjects));
  // projectStorage.clearAll();
  
  }


  // await projectStorage.set('projects', JSON.stringify(remainingProjects));
  // projectStorage.clearAll(); 

  ToastAndroid.show('Upload completed.', ToastAndroid.SHORT);
  setLoading(false);
};





  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: theme.colors.background }}>
        <Header />
        <View style={{ padding: 30, gap: 5, flex: 1 }}>
          <Text
            variant="headlineLarge"
            style={{
              paddingBottom: 5,
              color: theme.colors.secondary,
            }}>
            Saved Projects
          </Text>
          
          
          {projects.length === 0 ? (
            <>
            <Text variant="titleMedium">No saved projects found.</Text>
          {loadingPro && (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="small" color="#6B7280" /> {/* Tailwind gray-500 */}
            </View>
          )} 
          
            </>
          ) : (
            projects.map((project, index) => (
              <View key={index} style={styles.projectContainer}>
                <Text variant="bodyLarge">Project ID: {project.approval_no}</Text>
                <Divider
                  style={{
                    marginVertical: 5,
                  }}
                />
                <Text variant="bodyMedium">Progress: {project.progress_percent}</Text>
                <Text variant="bodyMedium">Latitude: {project.lat}</Text>
                <Text variant="bodyMedium">Longitude: {project.long}</Text>
                <Text variant="bodyMedium">
                  Address: {project.address}
                </Text>
                <ScrollView horizontal style={styles.imagesContainer}>
                  {project['progress_pic[]'].map((uri: string, idx: number) => (
                    <TouchableRipple
                      key={idx}
                      onPress={() => handleImagePress(uri)}>
                      <Image
                        key={idx}
                        source={{ uri }}
                        style={styles.image}
                        resizeMode="contain"
                      />
                    </TouchableRipple>
                  ))}
                </ScrollView>
              </View>
            ))
          )}
   {projects.length > 0 && (
          <ButtonPaper
            icon={'refresh'}
            mode="contained"
            loading={loading}
            // onPress={fetchProjects}
            onPress={()=>{updateProjectLive()}}
            style={{
              paddingVertical: 8,
            }}>
            Make Data Live
          </ButtonPaper>
   )}
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
    borderStyle: 'dashed',
    borderColor: '#888',
    borderRadius: 20,
    // paddingBottom: 10
  },
  imagesContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  }
});
