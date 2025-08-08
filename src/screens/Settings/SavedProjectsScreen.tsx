import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
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
import { loginToken, projectSaveSpecificStorage } from '../../storage/appStorage';
import Header from '../../components/Header';
import ButtonPaper from '../../components/ButtonPaper';
import { usePaperColorScheme } from '../../theme/theme';
import { ProjectStoreModel } from '../../models/global_models';
import FileViewer from 'react-native-file-viewer';
import axios from 'axios';
import { ADDRESSES } from '../../config/api_list';
import InternetStatusContext from '../../context/InternetStatusContext';
import useloadLiveProjectList from '../../hooks/useLoadLiveProjectList';
// import { AUTH_KEY, REVERSE_GEOENCODING_API_KEY } from '@env';

const REVERSE_GEOENCODING_API_KEY = 'AIzaSyDdA5VPRPZXt3IiE3zP15pet1Nn200CRzg'

const SavedProjectsScreen = () => {
  const theme = usePaperColorScheme();
  const [projects, setProjects] = useState<ProjectStoreModel[]>([]);
  const navigation = useNavigation();
  const [loadingPro, setLoadingPro] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const isOnline = useContext(InternetStatusContext);
  const { loadingLivePro, loadLiveProjectList } = useloadLiveProjectList();
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const loginTokenStore = useMemo(
          () => JSON.parse(loginToken?.getString('login-token') ?? '{}'),
          [],
      );

  const fetchLocalStorageProjects = async () => {
    // Alert.alert('Fetching Projects', 'Please wait while we fetch your saved projects.');
    setLoadingPro(true)
    try {
      // Alert.alert('Fetching Projects ggg', 'Please wait while we fetch your saved projects.');
      // console.log('projects_date____utsabbbbbbbbbbbbbbbbb :--' );
       
      // const projectsData_Date = projectSaveSpecificStorage.getString('projects_date');
      const parsedProjects_Date = projectSaveSpecificStorage.getString('projects_date');
      // const parsedProjects_Date = JSON.parse(projectsData_Date ?? '');
      console.log(parsedProjects_Date, 'projects_date____utsabbbbbbbbbbbbbbbbb');
      
      
      const projectsData = projectSaveSpecificStorage.getString('projects');

      console.log(projectsData, 'projects_date____utsabbbbbbbbbbbbbbbbb', parsedProjects_Date);

      if (projectsData) {
        const parsedProjects = JSON.parse(projectsData);
        console.log(parsedProjects, 'projects____', projects);
        // setTimeout(() => {
         
        // }, 2000);
        // Enrich projects with addresses if missing
      const enrichedProjects = await Promise.all(
        parsedProjects.map(async (proj: ProjectStoreModel) => {
          if (!proj.address && proj.lat && proj.long) {
            const address = await getAddressFromCoordinates(proj.lat.toString(), proj.long.toString());
            return { ...proj, address };
          }
          return proj;
        })
      );


        setProjects(enrichedProjects); 
        setLoadingPro(false)
        
      } else {
        setProjects([]);
        setLoadingPro(false)
      }
    } catch (error) {
      console.log('Clear All Projects:', error);
      ToastAndroid.show('Clear All Projects.', ToastAndroid.SHORT);
      setLoadingPro(false)
    }
  };

  useEffect(() => {
  // && isFocused
  if (isOnline) {
  fetchLocalStorageProjects()
  }
  
 
         
     }, [isOnline, isFocused]);


    useEffect(() => {
       console.log('isFocused', isFocused);
        if(isFocused){
        fetchLocalStorageProjects();
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



 


const getAddressFromCoordinates = async (lat: string, long: string): Promise<string> => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${REVERSE_GEOENCODING_API_KEY}`
    );

    const address = response?.data?.results?.[0]?.formatted_address;
    return address || '';
  } catch (error) {
    console.log(`Failed to fetch address for lat: ${lat}, long: ${long}`, error);
    return '';
  }
};


const updateProjectLive = async () => {
  setLoading(true);

  const stored = await projectSaveSpecificStorage.getString('projects');
  let storedProjects: any[] = stored ? JSON.parse(stored) : [];

  const successfullyUploadedApprovalNos: string[] = [];

  for (let i = 0; i < storedProjects.length; i++) {
    const project = storedProjects[i];
    const formData = new FormData();

    const address = await getAddressFromCoordinates(project.lat.toString(), project.long.toString());

    formData.append('approval_no', project.approval_no);
    formData.append('progress_percent', project.progress_percent.toString());
    formData.append('progressive_percent', project.progressive_percent.toString());
    formData.append('lat', project.lat.toString());
    formData.append('long', project.long.toString());
    formData.append('address', address);
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
  console.log('Clearing all old projects data from storage', 'projectSaveSpecificStorage');
  
  projectSaveSpecificStorage.clearAll();
  setProjects([]);
  console.log('Clearing all old projects data from storage', 'setProjects([])');
  // fetchLocalStorageProjects();

  if (remainingProjects.length > 0) {
  console.log('Remaining projects after upload:', remainingProjects);
  projectSaveSpecificStorage.set('projects', JSON.stringify(remainingProjects));
  loadLiveProjectList()
  } else {
  loadLiveProjectList()
  }


  // await projectSaveSpecificStorage.set('projects', JSON.stringify(remainingProjects));
  // projectSaveSpecificStorage.clearAll(); 

  fetchLocalStorageProjects();

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
              <ActivityIndicator size="small" color="#6B7280" /> 
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
            <>
            {isOnline ? (

            <ButtonPaper
            icon={'refresh'}
            mode="contained"
            loading={loading}
            onPress={()=>{updateProjectLive()}}
            style={{
            paddingVertical: 8,
            }}>
            Make Data Live
            </ButtonPaper>

            ):(
            <>
            <Text variant="bodyMedium" style={styles.oflineText}>
              You are offline. Please connect to the internet to make data live.  </Text>
            </> 
            )}
            </>
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
  },
  oflineText: {
    color: '#fff', 
    textAlign: 'center', 
    fontWeight:700, 
    fontSize:14, 
    backgroundColor: '#cf820fff', 
    padding: 6, 
    borderRadius: 10
  }
});
