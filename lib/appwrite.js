import { Account, Avatars, Client, Databases, ID, Storage } from 'react-native-appwrite';

// Konfigurasi Appwrite
// Tips: Di masa depan, sebaiknya pindahkan nilai ini ke file .env (EXPO_PUBLIC_...)
export const appwriteConfig = {
  endpoint: 'https://sgp.cloud.appwrite.io/v1',
  projectId: '699982d40036cc7c2bda',
  platform: 'com.roboedu.studio',
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);

// Fungsi untuk mengecek koneksi ke Appwrite
export const checkConnection = async () => {
  try {
    const res = await account.get();
    console.log('Appwrite Connected:', res);
  } catch (error: any) {
    console.log('Appwrite Connection Status:', error.message || error);
  }
};

// Export ID agar mudah digunakan untuk membuat ID unik: ID.unique()
export { ID };

export default client;

// Fungsi untuk mendaftarkan user baru
export const createUser = async (email: string, password: string, name: string) => {
  try {
    // ID.unique() akan membuatkan ID acak secara otomatis untuk user
    const newAccount = await account.create(
      ID.unique(), 
      email, 
      password, 
      name
    );
    console.log("Akun berhasil dibuat!", newAccount);
    return newAccount;
  } catch (error: any) {
    console.error("Gagal membuat akun:", error);
    throw new Error(error.message || "Failed to create user");
  }
};
