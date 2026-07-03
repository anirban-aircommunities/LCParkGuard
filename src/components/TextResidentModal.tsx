import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { Colors } from '../constants/Colors';

const QUICK_MESSAGES = [
  { id: 'ada', label: 'Parked in ADA' },
  { id: 'fireLane', label: 'Parked in Fire Lane' },
  { id: 'hydrant', label: 'Blocked Fire Hydrant' },
  { id: 'assignedSpot', label: 'Not in Assigned Spot' },
] as const;

interface TextResidentModalProps {
  visible: boolean;
  onClose: () => void;
  licensePlate: string;
  propertyName?: string;
}

function buildQuickMessage(
  type: (typeof QUICK_MESSAGES)[number]['id'],
  licensePlate: string,
  propertyName?: string,
): string {
  const location = propertyName ? ` at ${propertyName}` : '';
  const plate = licensePlate.toUpperCase();

  switch (type) {
    case 'ada':
      return `Parking notice: Vehicle ${plate}${location} is parked in an ADA space. Please move your vehicle immediately.`;
    case 'fireLane':
      return `Parking notice: Vehicle ${plate}${location} is parked in a fire lane. Please move your vehicle immediately.`;
    case 'hydrant':
      return `Parking notice: Vehicle ${plate}${location} is blocking a fire hydrant. Please move your vehicle immediately.`;
    case 'assignedSpot':
      return `Parking notice: Vehicle ${plate}${location} is not parked in its assigned spot. Please move your vehicle to the correct location.`;
    default:
      return `Parking notice for plate ${plate}. Please contact parking enforcement.`;
  }
}

const TextResidentModal: React.FC<TextResidentModalProps> = ({
  visible,
  onClose,
  licensePlate,
  propertyName,
}) => {
  const [residentName, setResidentName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (visible) {
      setResidentName('');
      setPhoneNumber('');
      setMessage('');
    }
  }, [visible]);

  const canSend = phoneNumber.trim().length > 0 && message.trim().length > 0;

  const handleQuickMessage = (type: (typeof QUICK_MESSAGES)[number]['id']) => {
    setMessage(buildQuickMessage(type, licensePlate, propertyName));
  };

  const handleSendText = () => {
    if (!canSend) {
      Alert.alert('Missing Information', 'Phone number and message are required.');
      return;
    }

    const digits = phoneNumber.replace(/\D/g, '');
    const smsUrl =
      Platform.OS === 'ios'
        ? `sms:${digits}&body=${encodeURIComponent(message.trim())}`
        : `sms:${digits}?body=${encodeURIComponent(message.trim())}`;

    Linking.openURL(smsUrl).catch(() => {
      Alert.alert('Unable to open Messages');
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Text Resident</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formContent}>
            <Text style={styles.label}>Resident Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter resident name"
              placeholderTextColor={Colors.textLight}
              value={residentName}
              onChangeText={setResidentName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>
              Phone Number<Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., (555) 123-4567"
              placeholderTextColor={Colors.textLight}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>
              Message<Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Click the button to use the auto-generated message, or type your own"
              placeholderTextColor={Colors.textLight}
              value={message}
              onChangeText={setMessage}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.quickMessageGrid}>
              {QUICK_MESSAGES.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.quickMessageButton}
                  onPress={() => handleQuickMessage(item.id)}>
                  <Text style={styles.quickMessageButtonText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
              onPress={handleSendText}
              disabled={!canSend}>
              <Text style={styles.sendButtonIcon}>💬</Text>
              <Text style={styles.sendButtonText}>Send Text</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  closeButtonText: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  formContent: {
    padding: 16,
    paddingBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  required: {
    color: Colors.error,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageInput: {
    minHeight: 90,
    paddingTop: 12,
  },
  quickMessageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  quickMessageButton: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: Colors.tabPantone7546,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickMessageButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#B0BEC5',
    opacity: 0.85,
  },
  sendButtonIcon: {
    fontSize: 14,
  },
  sendButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
});

export default TextResidentModal;
