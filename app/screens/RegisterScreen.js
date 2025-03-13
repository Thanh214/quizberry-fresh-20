
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Platform,
  Image,
  KeyboardAvoidingView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';

// Cấu hình Firebase giữ nguyên
const firebaseConfig = {
  apiKey: "AIzaSyDdjKUec0aGVzExn1dPk-LkIraK7VqUJxk",
  authDomain: "smartlock-ccd1d.firebaseapp.com",
  projectId: "smartlock-ccd1d",
  storageBucket: "smartlock-ccd1d.appspot.com",
  messagingSenderId: "360774980468",
  appId: "1:360774980468:android:6d217dcfc513b0ae9bd221",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app); // Firebase Realtime Database

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [emailCheckIcon, setEmailCheckIcon] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });
  const [inputErrors, setInputErrors] = useState({});

  useEffect(() => {
    if (email) {
      setEmailCheckIcon(emailValid ? 'checkmark-circle' : 'close-circle');
    } else {
      setEmailCheckIcon(null);
    }
  }, [email, emailValid]);

  const onChangeDob = (event, selectedDate) => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      setDob(dateString);
    }
    setShowDatePicker(false);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = re.test(email);
    setEmailValid(valid);
    setInputErrors((prev) => ({
      ...prev,
      email: valid ? null : 'Email không hợp lệ.',
    }));
  };

  const validatePassword = (pwd) => {
    const strength = {
      length: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#\$%^&*(),.?":{}|<>]/.test(pwd),
    };
    setPasswordStrength(strength);
    const isStrong = Object.values(strength).every(Boolean);
    setInputErrors((prev) => ({
      ...prev,
      password: isStrong ? null : 'Mật khẩu không đạt yêu cầu.',
    }));
  };

  const handleRegister = async () => {
    let errors = {};
    if (!emailValid) errors.email = 'Email không hợp lệ.';
    const { length, upper, lower, number, special } = passwordStrength;
    if (!(length && upper && lower && number && special)) {
      errors.password = 'Mật khẩu không đạt yêu cầu.';
    }
    if (!name) errors.name = 'Vui lòng nhập họ và tên.';
    if (!phone) errors.phone = 'Vui lòng nhập số điện thoại.';
    if (!dob) errors.dob = 'Vui lòng chọn ngày sinh.';

    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Cập nhật thông tin người dùng
      await updateProfile(user, {
        displayName: name,
        phoneNumber: phone,
      });

      // Lưu thông tin đăng ký vào Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        displayName: name,
        phone,
        dob,
        password,
      });

      // Lưu đồng thời dữ liệu vào Firebase Realtime Database
      await set(ref(rtdb, 'users/' + user.uid), {
        email,
        displayName: name,
        phone,
        dob,
        password,     
      });

      setTimeout(() => {
        Alert.alert(
          'Đăng ký thành công',
          'Bạn đã đăng ký thành công!',
          [
            { text: 'OK', onPress: () => navigation.navigate('Login') }
          ],
          { cancelable: false }
        );
      }, 100);
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email này đã được sử dụng.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email không hợp lệ.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.';
          break;
        default:
          break;
      }
      Alert.alert('Lỗi đăng ký', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.container}>
        {/* Enhanced logo section with animation */}
        <Animatable.View 
          animation="bounceIn" 
          duration={1500} 
          style={styles.logoWrapper}
        >
          <LinearGradient
            colors={['#FF9966', '#FF5E62']}
            style={styles.logoCircle}
          >
            <Image
              source={require('../assets/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </LinearGradient>
        </Animatable.View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animatable.View animation="fadeInUp" duration={800} style={styles.formWrapper}>
            <Text style={styles.title}>SmartLock</Text>
            <Text style={styles.subtitle}>Tạo tài khoản mới</Text>

            <Animatable.View animation="fadeInUp" duration={1000} delay={300} style={styles.formContainer}>
              {/* Email Input */}
              <View style={[styles.inputContainer, inputErrors.email && styles.inputContainerError]}>
                <Ionicons name="mail-outline" size={22} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#888"
                  onChangeText={(value) => {
                    setEmail(value);
                    validateEmail(value);
                  }}
                  value={email}
                  keyboardType="email-address"
                />
                {emailCheckIcon && (
                  <Ionicons
                    name={emailCheckIcon}
                    size={22}
                    style={[
                      styles.inputIconRight,
                      { color: emailValid ? '#4CAF50' : '#F44336' }
                    ]}
                  />
                )}
              </View>
              {inputErrors.email && <Text style={styles.errorText}>{inputErrors.email}</Text>}

              {/* Name Input */}
              <View style={[styles.inputContainer, inputErrors.name && styles.inputContainerError]}>
                <Ionicons name="person-outline" size={22} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Họ và tên"
                  placeholderTextColor="#888"
                  onChangeText={setName}
                  value={name}
                />
              </View>
              {inputErrors.name && <Text style={styles.errorText}>{inputErrors.name}</Text>}

              {/* Phone Input */}
              <View style={[styles.inputContainer, inputErrors.phone && styles.inputContainerError]}>
                <Ionicons name="call-outline" size={22} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Số điện thoại"
                  placeholderTextColor="#888"
                  onChangeText={setPhone}
                  value={phone}
                  keyboardType="phone-pad"
                />
              </View>
              {inputErrors.phone && <Text style={styles.errorText}>{inputErrors.phone}</Text>}

              {/* Date of Birth Input */}
              <View style={[styles.inputContainer, inputErrors.dob && styles.inputContainerError]}>
                <Ionicons name="calendar-outline" size={22} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Ngày sinh (YYYY-MM-DD)"
                  placeholderTextColor="#888"
                  value={dob}
                  editable={false}
                />
                <TouchableOpacity 
                  onPress={() => setShowDatePicker(true)}
                  style={styles.calendarButton}
                >
                  <Ionicons name="calendar" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dob ? new Date(dob) : new Date()}
                  mode="date"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onChangeDob}
                />
              )}
              {inputErrors.dob && <Text style={styles.errorText}>{inputErrors.dob}</Text>}

              {/* Password Input */}
              <View style={[styles.inputContainer, inputErrors.password && styles.inputContainerError]}>
                <Ionicons name="lock-closed-outline" size={22} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu"
                  placeholderTextColor="#888"
                  secureTextEntry={!showPassword}
                  onChangeText={(value) => {
                    setPassword(value);
                    validatePassword(value);
                  }}
                  value={password}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={22} 
                    style={styles.inputIconRight} 
                  />
                </TouchableOpacity>
              </View>
              {inputErrors.password && <Text style={styles.errorText}>{inputErrors.password}</Text>}

              {/* Password Checklist */}
              <View style={styles.passwordChecklist}>
                <Text style={[styles.checkItem, passwordStrength.length && styles.checkItemValid]}>
                  • Tối thiểu 8 ký tự
                </Text>
                <Text style={[styles.checkItem, passwordStrength.upper && styles.checkItemValid]}>
                  • Ít nhất 1 chữ cái in hoa
                </Text>
                <Text style={[styles.checkItem, passwordStrength.lower && styles.checkItemValid]}>
                  • Ít nhất 1 chữ cái thường
                </Text>
                <Text style={[styles.checkItem, passwordStrength.number && styles.checkItemValid]}>
                  • Ít nhất 1 số
                </Text>
                <Text style={[styles.checkItem, passwordStrength.special && styles.checkItemValid]}>
                  • Ít nhất 1 ký tự đặc biệt
                </Text>
              </View>

              {/* Register Button */}
              <TouchableOpacity 
                style={styles.registerButton} 
                onPress={handleRegister}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#FF9966', '#FF5E62']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.registerButtonText}>Đăng ký</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Link to Login Screen */}
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>
                  Đã có tài khoản? <Text style={styles.loginTextHighlight}>Đăng nhập</Text>
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          </Animatable.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 0,
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainerError: {
    borderWidth: 1,
    borderColor: '#F44336',
  },
  inputIcon: {
    color: '#FF8C66',
    marginRight: 10,
  },
  inputIconRight: {
    color: '#888',
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  calendarButton: {
    backgroundColor: '#FF8C66',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  passwordChecklist: {
    marginBottom: 25,
    paddingLeft: 5,
  },
  checkItem: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  checkItemValid: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#FF8C66',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 15,
    marginTop: 8,
  },
  loginTextHighlight: {
    color: '#FF8C66',
    fontWeight: 'bold',
  }
});

export default RegisterScreen;
