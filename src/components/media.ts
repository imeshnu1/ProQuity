// Photo and document pickers. BACKEND: upload the picked file to storage and save its URL.
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

export async function pickImage(): Promise<string | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;
  const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
  if (r.canceled || !r.assets?.[0]) return null;
  return r.assets[0].uri;
}

export async function pickDocument(): Promise<{ name: string; size: string } | null> {
  const r = await DocumentPicker.getDocumentAsync({
    type: ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    copyToCacheDirectory: false,
  });
  if (r.canceled || !r.assets?.[0]) return null;
  const a = r.assets[0];
  const mb = a.size ? Math.max(1, Math.round(a.size / 1024 / 1024)) : 1;
  return { name: a.name, size: `${mb} MB` };
}
