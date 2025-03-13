import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  BackHandler,
  Modal,
  Platform,
  SafeAreaView,
  TextInput,
  Image,
  StatusBar
} from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, remove, update } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDdjKUec0aGVzExn1dPk-LkIraK7VqUJxk",
  authDomain: "smartlock-ccd1d.firebaseapp.com",
  projectId: "smartlock-ccd1d",
  storageBucket: "smartlock-ccd1d.appspot.com",
  messagingSenderId: "360774980468",
  appId: "1:360774980468:android:6d217dcfc513b0ae9bd221",
};

// Initialize Firebase once
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}
const db = getFirestore(app);
const auth = getAuth(app);
const rtdb = getDatabase(app);

// User card background colors
const userColors = ['#FFF3E0', '#E3F2FD', '#F1F8E9', '#E8EAF6', '#FFEBEE'];

const AdminHomeScreen = () => {
  // State lưu danh sách người dùng
  const [users, setUsers] = useState([]);
  // State điều khiển modal quản lý khách hàng
  const [userManagementVisible, setUserManagementVisible] = useState(false);
  // State điều khiển modal quản lý vân tay
  const [fingerprintManagementVisible, setFingerprintManagementVisible] = useState(false);
  // State điều khiển modal nhập ID vân tay
  const [isFingerprintInputVisible, setFingerprintInputVisible] = useState(false);
  // State lưu giá trị nhập của fingerprint ID
  const [fingerprintInput, setFingerprintInput] = useState('');
  // State lưu id của user đang được thêm vân tay
  const [selectedUserForFingerprint, setSelectedUserForFingerprint] = useState(null);

  // Hook điều hướng
  const navigation = useNavigation();

  // Mảng màu dùng cho hiệu ứng "nhấp nháy" cho text "Chào mừng Admin"
  const blinkingColors = ['red', 'green', 'blue'];
  // State lưu chỉ số màu hiện tại cho hiệu ứng nhấp nháy
  const [colorIndex, setColorIndex] = useState(0);

  // Lấy danh sách người dùng từ Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (querySnapshot) => {
        const usersList = querySnapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setUsers(usersList);
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Chặn nút Back trên Android
  useEffect(() => {
    const onBackPress = () => true; // Trả về true để chặn chức năng back
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, []);

  // Hiệu ứng nhấp nháy cho text "Chào mừng Admin"
  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex(prevIndex => (prevIndex + 1) % blinkingColors.length);
    }, 500); // Thay đổi màu mỗi 500ms
    return () => clearInterval(interval);
  }, []);

  // Style động cho hiệu ứng nhấp nháy dựa vào state colorIndex
  const blinkingStyle = {
    color: blinkingColors[colorIndex],
  };

  // Hàm đăng xuất
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert("Error", "Unable to logout, please try again.");
    }
  };

  // Xác nhận đăng xuất với hộp thoại Alert
  const confirmLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Đăng xuất", style: "destructive", onPress: handleLogout }
      ],
      { cancelable: true }
    );
  };

  // Hàm xem camera (chưa phát triển)
  const handleViewCamera = () => {
    Alert.alert("Xem camera", "Tính năng này sẽ được bổ sung sau!");
  };

  // Mở modal quản lý vân tay
  const handleAddFingerprint = () => {
    setFingerprintManagementVisible(true);
  };

  // Mở modal quản lý người dùng
  const openUserManagement = () => {
    setUserManagementVisible(true);
  };

  // Hàm xóa người dùng với xác nhận
  const handleDeleteUser = (userId, userName) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có muốn xóa ${userName}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              // Xóa user khỏi Firestore
              await deleteDoc(doc(db, 'users', userId));
              // Xóa user khỏi Realtime Database
              await remove(ref(rtdb, 'users/' + userId));
            } catch (error) {
              Alert.alert("Error", "Unable to delete user, please try again.");
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  // Khi bấm thêm vân tay cho user, lưu lại id của user và mở modal nhập ID
  const doAddFingerprint = (userId) => {
    setSelectedUserForFingerprint(userId);
    setFingerprintInput('');
    setFingerprintInputVisible(true);
  };

  // Hàm xác nhận thêm vân tay sau khi nhập ID, chuyển đổi input về dạng số nguyên
  const handleFingerprintInputConfirm = async () => {
    // Lấy giá trị nhập và loại bỏ khoảng trắng
    const inputStr = fingerprintInput.trim();
    if (!inputStr) {
      Alert.alert("Lỗi", "Fingerprint ID không được để trống.");
      return;
    }
    // Chuyển chuỗi nhập sang số nguyên
    const fpIdNumber = parseInt(inputStr, 10);
    // Nếu giá trị không phải là số nguyên, báo lỗi
    if (isNaN(fpIdNumber)) {
      Alert.alert("Lỗi", "Fingerprint ID phải là số nguyên.");
      return;
    }
    // Kiểm tra xem fingerprint ID đã tồn tại chưa (so sánh dưới dạng số)
    const fpExists = users.some(user => {
      const ids = Array.isArray(user.ID)
        ? user.ID.map(id => Number(id))
        : (typeof user.ID === 'number'
            ? [user.ID]
            : (typeof user.ID === 'string' ? [parseInt(user.ID, 10)] : []));
      return ids.some(id => id === fpIdNumber);
    });
    if (fpExists) {
      Alert.alert("Lỗi", "Fingerprint ID đã tồn tại, vui lòng nhập lại.");
      return;
    }
    try {
      // Lấy tài liệu user cần cập nhật
      const userDocRef = doc(db, 'users', selectedUserForFingerprint);
      const selectedUser = users.find(u => u.id === selectedUserForFingerprint);

      let newIDs = [];
      if (selectedUser && selectedUser.ID) {
        // Nếu user đã có ID, chuyển đổi chúng về số và thêm số mới
        const currentIDs = Array.isArray(selectedUser.ID)
          ? selectedUser.ID.map(id => Number(id))
          : (typeof selectedUser.ID === 'number'
              ? [selectedUser.ID]
              : (typeof selectedUser.ID === 'string'
                  ? [parseInt(selectedUser.ID, 10)]
                  : []));
        newIDs = [...currentIDs, fpIdNumber];
      } else {
        // Nếu chưa có, tạo mảng mới với số vừa nhập
        newIDs = [fpIdNumber];
      }

      // Cập nhật Firestore với ID mới
      await updateDoc(userDocRef, { ID: newIDs });
      // Cập nhật Realtime Database với ID mới
      await update(ref(rtdb, `users/${selectedUserForFingerprint}`), { ID: newIDs });
      // Ẩn modal sau khi cập nhật thành công
      setFingerprintInputVisible(false);
    } catch (error) {
      Alert.alert("Error", "Unable to add fingerprint, please try again.");
    }
  };

  // Hàm thực hiện xóa vân tay (không có xác nhận)
  const doRemoveFingerprint = async (userId, fpId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const selectedUser = users.find(u => u.id === userId);
      if (selectedUser && selectedUser.ID) {
        // Chuyển đổi các ID hiện có về số
        const currentIDs = Array.isArray(selectedUser.ID)
          ? selectedUser.ID.map(id => Number(id))
          : (typeof selectedUser.ID === 'number'
              ? [selectedUser.ID]
              : (typeof selectedUser.ID === 'string'
                  ? [parseInt(selectedUser.ID, 10)]
                  : []));
        // Lọc bỏ ID cần xóa
        const updatedIDs = currentIDs.filter(id => id !== fpId);
        // Cập nhật Firestore
        await updateDoc(userDocRef, { ID: updatedIDs });
        // Cập nhật Realtime Database
        await update(ref(rtdb, `users/${userId}`), { ID: updatedIDs });
      }
    } catch (error) {
      Alert.alert("Error", "Unable to remove fingerprint, please try again.");
    }
  };

  // Hàm xác nhận xóa vân tay (hiển thị hộp thoại Alert)
  const confirmRemoveFingerprint = (userId, fpId) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa vân tay này?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", style: "destructive", onPress: () => doRemoveFingerprint(userId, fpId) }
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C66" />
      <View style={styles.container}>

        {/* Header with gradient background */}
        <LinearGradient
          colors={['#FF8C66', '#FF5E62']}
          style={styles.header}
        >
          <Animatable.Text 
            animation="pulse" 
            iterationCount="infinite" 
            duration={1500} 
            style={styles.headerTitle}
          >
            Trang quản trị
          </Animatable.Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={confirmLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={22} color="#FF5E62" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Location selector */}
        <Animatable.View 
          animation="fadeInDown" 
          duration={800} 
          delay={200}
          style={styles.locationContainer}
        >
          <Text style={styles.locationText}>
            Địa điểm mặc định
          </Text>
          <View style={styles.locationSelector}>
            <Text style={styles.selectedLocation}>SmartLock Home</Text>
            <Ionicons name="chevron-down" size={20} color="#FF8C66" />
          </View>
        </Animatable.View>

        {/* Camera list */}
        <ScrollView contentContainerStyle={styles.cameraList}>
          <Animatable.View animation="fadeInUp" duration={800} delay={300}>
            <Text style={styles.sectionTitle}>Camera hoạt động</Text>
            
            {/* Camera 1 */}
            <TouchableOpacity 
              style={styles.cameraCard} 
              onPress={handleViewCamera}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: 'https://via.placeholder.com/350x200?text=Phòng+khách' }}
                style={styles.cameraImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.cameraGradient}
              >
                <View style={styles.cameraDetails}>
                  <View style={styles.cameraNameContainer}>
                    <Ionicons name="videocam" size={16} color="#FF8C66" />
                    <Text style={styles.cameraName}>Phòng khách</Text>
                  </View>
                  <View style={styles.cameraStatus}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Đang trực tuyến</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            
            {/* Camera 2 */}
            <TouchableOpacity 
              style={styles.cameraCard} 
              onPress={handleViewCamera}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: 'https://via.placeholder.com/350x200?text=Cam+nhà+cậu' }}
                style={styles.cameraImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.cameraGradient}
              >
                <View style={styles.cameraDetails}>
                  <View style={styles.cameraNameContainer}>
                    <Ionicons name="videocam" size={16} color="#FF8C66" />
                    <Text style={styles.cameraName}>Cam nhà cậu</Text>
                  </View>
                  <View style={styles.cameraStatus}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Đang trực tuyến</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
          
          <Animatable.View animation="fadeInUp" duration={800} delay={400}>
            <Text style={styles.sectionTitle}>Thống kê hệ thống</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons name="people" size={24} color="#FF8C66" />
                <Text style={styles.statCount}>{users.length}</Text>
                <Text style={styles.statLabel}>Người dùng</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ionicons name="finger-print" size={24} color="#FF8C66" />
                <Text style={styles.statCount}>
                  {users.reduce((count, user) => {
                    const ids = Array.isArray(user.ID) ? user.ID.length : (user.ID ? 1 : 0);
                    return count + ids;
                  }, 0)}
                </Text>
                <Text style={styles.statLabel}>Vân tay</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ionicons name="videocam" size={24} color="#FF8C66" />
                <Text style={styles.statCount}>2</Text>
                <Text style={styles.statLabel}>Camera</Text>
              </View>
            </View>
          </Animatable.View>
        </ScrollView>

        {/* Bottom tab navigation */}
        <View style={styles.bottomTabContainer}>
          <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
            <Ionicons name="home" size={22} color="#FF8C66" />
            <Text style={styles.activeTabText}>Trang chủ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={handleAddFingerprint}>
            <Ionicons name="finger-print-outline" size={22} color="#777" />
            <Text style={styles.tabText}>Vân tay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={openUserManagement}>
            <Ionicons name="people-outline" size={22} color="#777" />
            <Text style={styles.tabText}>Khách hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="notifications-outline" size={22} color="#777" />
            <Text style={styles.tabText}>Thông báo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="settings-outline" size={22} color="#777" />
            <Text style={styles.tabText}>Cài đặt</Text>
          </TouchableOpacity>
        </View>

        {/* User Management Modal */}
        <Modal
          visible={userManagementVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setUserManagementVisible(false)}
        >
          <SafeAreaView style={styles.modalSafeArea}>
            <LinearGradient
              colors={['#FF8C66', '#FF5E62']}
              style={styles.modalHeader}
            >
              <Text style={styles.modalHeaderTitle}>Quản lý người dùng</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setUserManagementVisible(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {users.length === 0 ? (
                <Animatable.View animation="fadeIn" duration={800} style={styles.emptyStateContainer}>
                  <Ionicons name="people" size={60} color="#ccc" />
                  <Text style={styles.emptyStateText}>Chưa có người dùng nào</Text>
                </Animatable.View>
              ) : (
                users.map((user, index) => (
                  <Animatable.View
                    key={user.id}
                    animation="fadeInUp"
                    duration={500}
                    delay={index * 100}
                  >
                    <View
                      style={[
                        styles.userItem,
                        { backgroundColor: userColors[index % userColors.length] }
                      ]}
                    >
                      <View style={styles.userAvatarContainer}>
                        <View style={styles.userAvatar}>
                          <Text style={styles.userInitial}>
                            {(user.displayName || "U")[0].toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.userInfoContainer}>
                        <Text style={styles.userName}>
                          {user.displayName || "Chưa có tên"}
                        </Text>
                        <Text style={styles.userInfo}>
                          <Ionicons name="mail-outline" size={14} color="#777" /> {user.email || "N/A"}
                        </Text>
                        <Text style={styles.userInfo}>
                          <Ionicons name="call-outline" size={14} color="#777" /> {user.phone || "N/A"}
                        </Text>
                        <Text style={styles.userInfo}>
                          <Ionicons name="calendar-outline" size={14} color="#777" /> {user.dob || "N/A"}
                        </Text>
                        <View style={styles.userActions}>
                          <TouchableOpacity style={styles.userActionButton}>
                            <Ionicons name="create-outline" size={18} color="#FF8C66" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.userActionButton, styles.deleteButton]}
                            onPress={() => handleDeleteUser(user.id, user.displayName)}
                          >
                            <Ionicons name="trash-outline" size={18} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Animatable.View>
                ))
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* Fingerprint Management Modal */}
        <Modal
          visible={fingerprintManagementVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setFingerprintManagementVisible(false)}
        >
          <SafeAreaView style={styles.modalSafeArea}>
            <LinearGradient
              colors={['#FF8C66', '#FF5E62']}
              style={styles.modalHeader}
            >
              <Text style={styles.modalHeaderTitle}>Quản lý vân tay</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setFingerprintManagementVisible(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {users.length === 0 ? (
                <Animatable.View animation="fadeIn" duration={800} style={styles.emptyStateContainer}>
                  <Ionicons name="finger-print" size={60} color="#ccc" />
                  <Text style={styles.emptyStateText}>Chưa có dữ liệu vân tay</Text>
                </Animatable.View>
              ) : (
                users.map((user, index) => {
                  const ids = Array.isArray(user.ID)
                    ? user.ID
                    : (typeof user.ID === 'string' ? [user.ID] : []);
                  return (
                    <Animatable.View
                      key={user.id}
                      animation="fadeInUp"
                      duration={500}
                      delay={index * 100}
                    >
                      <View
                        style={[
                          styles.fpUserItem,
                          { backgroundColor: userColors[index % userColors.length] }
                        ]}
                      >
                        <View style={styles.fpUserHeader}>
                          <View style={styles.fpUserAvatar}>
                            <Text style={styles.fpUserInitial}>
                              {(user.displayName || "U")[0].toUpperCase()}
                            </Text>
                          </View>
                          <Text style={styles.fpUserName}>
                            {user.displayName || "Chưa có tên"}
                          </Text>
                        </View>
                        
                        {ids.length > 0 ? (
                          <View style={styles.fingerprintList}>
                            {ids.map((id, idx) => (
                              <View key={idx} style={styles.fingerprintItem}>
                                <Ionicons name="finger-print" size={20} color="#FF8C66" />
                                <Text style={styles.fingerprintText}>ID: {id}</Text>
                                <TouchableOpacity
                                  onPress={() => confirmRemoveFingerprint(user.id, id)}
                                  style={styles.fpRemoveButton}
                                >
                                  <Ionicons name="trash-outline" size={18} color="#fff" />
                                </TouchableOpacity>
                              </View>
                            ))}
                          </View>
                        ) : (
                          <Text style={styles.noFingerprintText}>Chưa có vân tay</Text>
                        )}
                        
                        <TouchableOpacity
                          style={styles.fpAddButton}
                          onPress={() => doAddFingerprint(user.id)}
                        >
                          <Ionicons name="add" size={20} color="#fff" />
                          <Text style={styles.fpAddButtonText}>Thêm vân tay</Text>
                        </TouchableOpacity>
                      </View>
                    </Animatable.View>
                  );
                })
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* Fingerprint Input Modal */}
        <Modal
          visible={isFingerprintInputVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setFingerprintInputVisible(false)}
        >
          <View style={styles.fingerprintInputModalContainer}>
            <Animatable.View 
              animation="zoomIn" 
              duration={300} 
              style={styles.fingerprintInputModal}
            >
              <View style={styles.fingerprintInputHeader}>
                <Ionicons name="finger-print" size={30} color="#FF8C66" />
                <Text style={styles.modalTitle}>Thêm vân tay mới</Text>
              </View>
              
              <Text style={styles.fingerprintInputLabel}>
                Nhập ID vân tay (số nguyên)
              </Text>
              <TextInput
                style={styles.fingerprintInput}
                value={fingerprintInput}
                onChangeText={setFingerprintInput}
                placeholder="Ví dụ: 1234"
                keyboardType="number-pad"
                placeholderTextColor="#999"
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => setFingerprintInputVisible(false)}
                  style={[styles.modalButton, styles.cancelButton]}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleFingerprintInputConfirm}
                  style={[styles.modalButton, styles.confirmButton]}
                >
                  <Text style={styles.confirmButtonText}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Platform.OS === 'ios' ? 20 : 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  logoutButton: {
    position: 'absolute',
    right: 20,
    width: 44,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  locationContainer: {
    margin: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  locationText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedLocation: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 15,
    marginTop: 10,
    marginHorizontal: 20,
  },
  cameraList: {
    paddingBottom: 80,
  },
  cameraCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cameraImage: { 
    width: '100%', 
    height: 180 
  },
  cameraGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    padding: 15,
    justifyContent: 'flex-end',
  },
  cameraDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cameraNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
  cameraStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 5,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statCount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
  },
  bottomTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 65,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabItem: { 
    alignItems: 'center', 
    justifyContent: 'center',
    height: 45,
    paddingHorizontal: 12,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 140, 102, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  tabText: { 
    fontSize: 12, 
    marginTop: 4, 
    color: '#777' 
  },
  activeTabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#FF8C66',
    fontWeight: '600',
  },
  modalSafeArea: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Platform.OS === 'ios' ? 20 : 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  modalHeaderTitle: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  modalCloseButton: { 
    position: 'absolute', 
    right: 15, 
    padding: 8 
  },
  modalContent: { 
    padding: 20,
    paddingTop: 25,
  },
  emptyState
