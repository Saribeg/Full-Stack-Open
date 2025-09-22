import { Text, StyleSheet, View, Image } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
});

const RepositoryItem = ({
  ownerAvatarUrl,
  fullName,
  description,
  language,
  forksCount,
  stargazersCount,
  ratingAverage,
  reviewCount,
}) => (
  <View style={styles.container}>
    <Image source={{ uri: ownerAvatarUrl }} style={styles.avatar} />
    <Text>Full name: {fullName}</Text>
    <Text>Description: {description}</Text>
    <Text>Language: {language}</Text>
    <Text>Stars: {stargazersCount}</Text>
    <Text>Forks: {forksCount}</Text>
    <Text>Reviews: {reviewCount}</Text>
    <Text>Rating: {ratingAverage}</Text>
  </View>
);

export default RepositoryItem;