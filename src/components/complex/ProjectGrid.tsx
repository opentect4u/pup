import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ToastAndroid,
} from 'react-native';
import { usePaperColorScheme } from '../../theme/theme';
import CircularProgress from '../CircularProgress';
import DialogBox from '../DialogBox';
import FileViewer from 'react-native-file-viewer';
import { TouchableRipple } from 'react-native-paper';

type ProjectGridProps = {
  fetchedProjectDetails: string;
};

const ProjectGrid: React.FC<ProjectGridProps> = ({ fetchedProjectDetails }) => {
  const theme = usePaperColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);

  // Parse the fetched details once.
  const projectData = fetchedProjectDetails
    ? JSON.parse(fetchedProjectDetails)
    : null;
  const baseURL = 'https://pup.opentech4u.co.in/pup/';

  const handleItemPress = (item: any) => {
    let images: any[] = [];
    try {
      images = JSON.parse(item.pic_path);
    } catch (error) {
      console.error('Error parsing pic_path for item:', item, error);
    }
    setSelectedItem(item);
    setSelectedImages(images);
    setModalVisible(true);
  };

  const handleImagePress = async (uri: string) => {
    try {
      await FileViewer.open(uri, { showOpenWithDialog: true });
    } catch (error) {
      console.log('Error opening image with FileViewer:', error);
      ToastAndroid.show('Error opening image.', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* Grid View */}
      {projectData && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 10,
          }}>
          {projectData.prog_img.map((item: any, idx: number) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleItemPress(item)}
              style={{
                width: '30%', // Approximately 3 items per row.
                aspectRatio: 1, // Makes the view a square.
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                borderWidth: 0.8,
                borderRadius: 10,
                borderColor: theme.colors.onBackground,
                borderStyle: 'dashed',
              }}>
              <CircularProgress
                percentage={item?.progress_percent}
                radius={40}
                strokeWidth={10}
                color={theme.colors.primary}
                text={`${item?.progress_percent}%`}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Modal Dialog */}
      {selectedItem && (
        <DialogBox
          visible={modalVisible}
          hide={() => setModalVisible(false)}
          onSuccess={() => setModalVisible(false)}
          title="Project Details"
          btnSuccess="Close"
          dismissable={true}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              borderWidth: 0.8,
              borderRadius: 10,
              borderColor: theme.colors.onBackground,
              marginTop: 15,
              borderStyle: 'dashed',
              backgroundColor: theme.colors.surface,
            }}>
            <View style={{ flex: 1 }}>
              <Text>Visit No.: {selectedItem?.visit_no}</Text>
              <Text>Approval No.: {selectedItem?.approval_no}</Text>
              <Text>Progress Percent: {selectedItem?.progress_percent}%</Text>
            </View>

            {selectedImages.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator>
                {selectedImages.map((img: any, index: number) => {
                  const imageUrl = `${baseURL}${projectData.folder_name}${img}`;
                  return (
                    <TouchableRipple
                      key={index}
                      onPress={() => handleImagePress(imageUrl)}
                      disabled>
                      <Image
                        key={index}
                        source={{ uri: imageUrl }}
                        style={{ width: 50, height: 50, marginLeft: 5 }}
                        resizeMode="cover"
                      />
                    </TouchableRipple>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </DialogBox>
      )}
    </View>
  );
};

export default ProjectGrid;
