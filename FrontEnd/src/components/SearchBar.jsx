import { View, TextInput } from "react-native";

export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={{ marginVertical: 10 }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search products..."
        style={{
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
          fontSize: 16,
        }}
      />
    </View>
  );
}
