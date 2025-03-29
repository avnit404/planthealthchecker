import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  TextInput,
  Text,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../../config/firebase";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Animated, { ZoomIn } from "react-native-reanimated";
import {
  initializePurchases,
  purchasePremium,
} from "../../utils/inAppPurchases";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const user = auth.currentUser;
  // State for the password prompt modal
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [resolvePrompt, setResolvePrompt] = useState(null);
  const [rejectPrompt, setRejectPrompt] = useState(null);

  // State for the delete confirmation modal
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);

  // State for the custom message modal
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [messageModalTitle, setMessageModalTitle] = useState("");
  const [messageModalContent, setMessageModalContent] = useState("");
  const [messageModalAction, setMessageModalAction] = useState(null);

  // Helper to show custom message modal
  const showMessageModal = (title, content, action = null) => {
    setMessageModalTitle(title);
    setMessageModalContent(content);
    setMessageModalAction(() => action);
    setMessageModalVisible(true);
  };

  // Called when user taps "OK" in the message modal
  const handleMessageModalOk = () => {
    setMessageModalVisible(false);
    if (messageModalAction) {
      messageModalAction();
    }
  };

  // Promise-based helper to prompt user for their password
  const promptUserForPassword = () => {
    return new Promise((resolve, reject) => {
      setResolvePrompt(() => resolve);
      setRejectPrompt(() => reject);
      setPasswordInput(""); // reset previous value
      setPasswordModalVisible(true);
    });
  };

  // Called when user taps "OK" in the password modal
  const handlePasswordSubmit = () => {
    if (resolvePrompt) {
      resolvePrompt(passwordInput);
    }
    setPasswordModalVisible(false);
    setResolvePrompt(null);
    setRejectPrompt(null);
  };

  // Called when user taps "Cancel" in the password modal
  const handlePasswordCancel = () => {
    if (rejectPrompt) {
      rejectPrompt("User cancelled");
    }
    setPasswordModalVisible(false);
    setResolvePrompt(null);
    setRejectPrompt(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/auth/login");
    } catch (error: any) {
      console.log("Error signing out:", error.message);
    }
  };

  // Show custom delete confirmation modal
  const handleDeleteAccount = () => {
    const user = auth.currentUser;
    if (!user || !user.email) {
      console.log("No user is currently signed in");
      return;
    }
    setConfirmDeleteModalVisible(true);
  };

  // Called when the user confirms deletion
  const handleConfirmDelete = async () => {
    console.log("Deletion initiated");
    setConfirmDeleteModalVisible(false);
    try {
      // Reauthenticate before deletion
      const password = await promptUserForPassword();
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      await user.delete();
      router.replace("/auth/register");
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login") {
        showMessageModal(
          "Session Expired",
          "For security reasons, please log out and log back in before deleting your account.",
          handleLogout
        );
      } else {
        showMessageModal(
          "Unable to Delete Account",
          "There was a problem deleting your account. Please try again later."
        );
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteModalVisible(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.hideScrollbar}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card with ZoomIn animation */}
        <Animated.View entering={ZoomIn.duration(200)} style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons
              name="account-circle"
              size={80}
              color="#4CAF50"
            />
            <ThemedText style={styles.userName}>
              {user?.email || "User"}
            </ThemedText>
          </View>

          <View style={styles.infoSection}>
            {/* Subscription Card */}
            <Animated.View
              entering={ZoomIn.duration(200)}
              style={styles.subscriptionCard}
            >
              <MaterialCommunityIcons
                name="star-circle"
                size={24}
                color="#945034"
              />
              <ThemedText style={styles.subscriptionTitle}>
                Free Plan
              </ThemedText>
              <ThemedText style={styles.subscriptionDetails}>
                Basic features included
              </ThemedText>
            </Animated.View>

            {/* Upgrade Card */}
            <Animated.View
              entering={ZoomIn.duration(200)}
              style={styles.upgradeCard}
            >
              <TouchableOpacity
                onPress={async () => {
                  if (Platform.OS === "web") {
                    showMessageModal(
                      "Not Available",
                      "In-app purchases are only available on iOS and Android devices"
                    );
                    return;
                  }
                  try {
                    const initialized = await initializePurchases();
                    if (!initialized) {
                      showMessageModal("Error", "Failed to initialize in-app purchases");
                      return;
                    }
                    const purchase = await purchasePremium();
                    if (purchase) {
                      showMessageModal("Success", "Premium plan activated!");
                    } else {
                      showMessageModal("Error", "Failed to process payment. Please try again.");
                    }
                  } catch (error) {
                    console.error("Error processing purchase:", error);
                    showMessageModal("Error", "An unexpected error occurred");
                  }
                }}
                style={styles.upgradeButton}
              >
                <MaterialCommunityIcons
                  name="crown"
                  size={30}
                  color="#945034"
                />
                <View>
                  <ThemedText style={styles.upgradeTitle}>
                    Upgrade to Premium
                  </ThemedText>
                  <ThemedText style={styles.upgradeDetails}>
                    Get access to all features
                  </ThemedText>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Logout & Delete Buttons */}
            <Animated.View entering={ZoomIn.duration(200)}>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <MaterialCommunityIcons
                  name="logout"
                  size={24}
                  color="#fff"
                />
                <ThemedText style={styles.logoutText}>Logout</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeleteAccount}
                style={[styles.logoutButton, styles.deleteButton]}
              >
                <MaterialCommunityIcons
                  name="account-remove"
                  size={24}
                  color="#fff"
                />
                <ThemedText style={[styles.logoutText, styles.deleteText]}>
                  Delete Account
                </ThemedText>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Password Prompt Modal */}
      <Modal
        visible={passwordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handlePasswordCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Password</Text>
            <TextInput
              style={styles.modalInput}
              secureTextEntry={true}
              placeholder="Password"
              placeholderTextColor="#999"
              value={passwordInput}
              onChangeText={setPasswordInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handlePasswordCancel}
                style={[styles.modalButton, styles.modalCancelButton]}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePasswordSubmit}
                style={[styles.modalButton, styles.modalOkButton]}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={confirmDeleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Are you sure you want to delete your account?
            </Text>
            <Text style={styles.modalSubtitle}>
              This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleCancelDelete}
                style={[styles.modalButton, styles.modalCancelButton]}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmDelete}
                style={[styles.modalButton, styles.modalDeleteButton]}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Message Modal */}
      <Modal
        visible={messageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleMessageModalOk}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{messageModalTitle}</Text>
            <Text style={styles.modalSubtitle}>{messageModalContent}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleMessageModalOk}
                style={[styles.modalButton, styles.modalOkButton]}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  hideScrollbar: {
    scrollbarWidth: "none",
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#ff4444",
  },
  deleteText: {
    color: "#ffffff",
  },
  container: {
    flex: 1,
    marginTop: 20,
    padding: Platform.select({ ios: 20, android: 16, default: 20 }),
    backgroundColor: "#FFDDAB",
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: Platform.select({ ios: 25, android: 20, default: 25 }),
    padding: Platform.select({ ios: 20, android: 16, default: 20 }),
    marginTop: Platform.select({ ios: 20, android: 16, default: 20 }),
    marginHorizontal: Platform.select({ ios: 0, android: 8, default: 0 }),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: Platform.select({ ios: 4, android: 2, default: 4 }),
    },
    shadowOpacity: Platform.select({ ios: 0.1, android: 0.05, default: 0.1 }),
    shadowRadius: Platform.select({ ios: 12, android: 8, default: 12 }),
    elevation: Platform.select({ ios: 5, android: 3, default: 5 }),
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  userName: {
    fontSize: Platform.select({ ios: 24, android: 22, default: 24 }),
    fontWeight: "bold",
    marginTop: Platform.select({ ios: 10, android: 8, default: 10 }),
    color: "#945034",
    textAlign: "center",
  },
  infoSection: {
    gap: Platform.select({ ios: 20, android: 16, default: 20 }),
    width: "100%",
  },
  subscriptionCard: {
    backgroundColor: "#ffffff",
    borderRadius: Platform.select({ ios: 12, android: 10, default: 12 }),
    padding: Platform.select({ ios: 20, android: 16, default: 20 }),
    alignItems: "center",
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: Platform.select({ ios: 2, android: 1, default: 2 }),
    },
    shadowOpacity: Platform.select({ ios: 0.1, android: 0.05, default: 0.1 }),
    shadowRadius: Platform.select({ ios: 4, android: 3, default: 4 }),
    elevation: Platform.select({ ios: 3, android: 2, default: 3 }),
  },
  subscriptionTitle: {
    fontSize: Platform.select({ ios: 20, android: 18, default: 20 }),
    fontWeight: "bold",
    marginTop: Platform.select({ ios: 10, android: 8, default: 10 }),
    color: "#945034",
    textAlign: "center",
  },
  subscriptionDetails: {
    opacity: 0.9,
    marginTop: Platform.select({ ios: 5, android: 4, default: 5 }),
    color: "#666",
    textAlign: "center",
  },
  upgradeCard: {
    backgroundColor: "#ffffff",
    borderRadius: Platform.select({ ios: 12, android: 10, default: 12 }),
    padding: Platform.select({ ios: 20, android: 16, default: 20 }),
    flexDirection: "row",
    alignItems: "center",
    gap: Platform.select({ ios: 15, android: 12, default: 15 }),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: Platform.select({ ios: 2, android: 1, default: 2 }),
    },
    shadowOpacity: Platform.select({ ios: 0.1, android: 0.05, default: 0.1 }),
    shadowRadius: Platform.select({ ios: 4, android: 3, default: 4 }),
    elevation: Platform.select({ ios: 3, android: 2, default: 3 }),
  },
  upgradeTitle: {
    fontSize: Platform.select({ ios: 18, android: 16, default: 18 }),
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "left",
  },
  upgradeDetails: {
    opacity: 0.9,
    fontSize: Platform.select({ ios: 14, android: 12, default: 14 }),
    color: "#333",
    textAlign: "left",
  },
  logoutButton: {
    backgroundColor: "#945034",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  logoutText: {
    fontSize: 16,
    color: "#fff",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 15,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "#ccc",
  },
  modalOkButton: {
    backgroundColor: "#007AFF",
  },
  modalDeleteButton: {
    backgroundColor: "#d32f2f",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});