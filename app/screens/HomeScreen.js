
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Platform, 
  TouchableOpacity, 
  Image, 
  Alert,
  BackHandler,
  ScrollView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const HomeScreen = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('devices');
  const navigation = useNavigation();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng xuất, vui lòng thử lại.");
      console.error("Lỗi đăng xuất:", error);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất không?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Đăng xuất", style: "destructive", onPress: handleLogout }
      ],
      { cancelable: true }
    );
  };

  const renderTabItem = (tabName, iconName, label) => (
    <TouchableOpacity 
      style={[styles.tabItem, activeTab === tabName && styles.activeTabItem]} 
      onPress={() => setActiveTab(tabName)}
    >
      <Ionicons 
        name={activeTab === tabName ? iconName : `${iconName}-outline`}
        size={24} 
        color={activeTab === tabName ? "#FF8C66" : "#777"} 
      />
      <Text style={[styles.tabLabel, activeTab === tabName && styles.activeTabLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C66" />
      
      {/* Header with gradient background */}
      <LinearGradient 
        colors={['#FF8C66', '#FF5E62']} 
        start={[0, 0]} 
        end={[1, 0]} 
        style={styles.header}
      >
        <Animatable.View animation="fadeIn" duration={800} style={styles.userInfo}>
          {user ? (
            <>
              <Text style={styles.greeting}>Chào mừng,</Text>
              <Text style={styles.userName}>
                {user.displayName || user.email || "Người dùng"}
              </Text>
            </>
          ) : (
            <Text style={styles.loadingText}>Đang tải thông tin...</Text>
          )}
        </Animatable.View>
        
        {/* Logout button */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={confirmLogout}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="log-out-outline" 
            size={20} 
            color="#FF5E62" 
            style={styles.logoutIcon} 
          />
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Main content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Animatable.View animation="fadeInUp" duration={800} delay={100}>
          <Text style={styles.sectionTitle}>Thiết bị đã kết nối</Text>
        </Animatable.View>
        
        <Animatable.View animation="fadeInUp" duration={800} delay={200} style={styles.cameraContainer}>
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.5)']}
            style={styles.videoFrame}
          >
            <View style={styles.videoPlaceholder}>
              <Ionicons name="videocam" size={40} color="#fff" />
              <Text style={styles.videoText}>Camera chính</Text>
            </View>
            <View style={styles.notification}>
              <Text style={styles.notificationText}>• Đang hoạt động</Text>
              <Text style={styles.notificationText}>Smartlock Camera</Text>
              <Text style={styles.notificationText}>{new Date().toLocaleTimeString()}</Text>
            </View>
            <TouchableOpacity style={styles.expandButton}>
              <Ionicons name="expand-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
          
          <TouchableOpacity 
            style={styles.settingsButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF8C66', '#FF5E62']}
              style={styles.settingsButtonGradient}
            >
              <Ionicons name="settings-outline" size={20} color="#fff" style={styles.settingsIcon} />
              <Text style={styles.settingsButtonText}>Cài đặt camera</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
        
        <Animatable.View animation="fadeInUp" duration={800} delay={300}>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
          
          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Ionicons name="lock-open-outline" size={24} color="#FF8C66" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Cửa chính đã mở</Text>
              <Text style={styles.activityTime}>Hôm nay, 10:42 AM</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </View>
          
          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Ionicons name="finger-print-outline" size={24} color="#FF8C66" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Xác thực vân tay</Text>
              <Text style={styles.activityTime}>Hôm nay, 08:30 AM</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </View>
          
          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Ionicons name="alert-circle-outline" size={24} color="#FF5E62" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Cảnh báo chuyển động</Text>
              <Text style={styles.activityTime}>Hôm qua, 11:20 PM</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </View>
        </Animatable.View>
      </ScrollView>

      {/* Bottom tab bar */}
      <View style={styles.tabBar}>
        {renderTabItem('devices', 'home', 'Thiết bị')}
        {renderTabItem('gallery', 'images', 'Thư viện')}
        {renderTabItem('smart', 'wifi', 'Kết nối')}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  userInfo: {
    marginBottom: 5,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  logoutIcon: {
    marginRight: 5,
  },
  logoutButtonText: {
    color: '#FF5E62',
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 90,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 15,
    marginTop: 10,
  },
  cameraContainer: {
    marginBottom: 30,
  },
  videoFrame: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 12,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  videoText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
    fontWeight: '500',
  },
  notification: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  notificationText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 2,
  },
  expandButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  settingsButton: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#FF8C66',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  settingsIcon: {
    marginRight: 8,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 140, 102, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 13,
    color: '#888',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tabItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  activeTabItem: {
    borderRadius: 20,
    backgroundColor: 'rgba(255, 140, 102, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  tabLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  activeTabLabel: {
    color: '#FF8C66',
    fontWeight: '600',
  },
});

export default HomeScreen;
