import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { router } from "expo-router";
import { fetchMovies } from "@/services/api";
import { useFetch } from "@/services/useFetch";
import SearchBar from "@/components/SearchBar";

const Search = () => {
  const [query, setQuery] = useState("");
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: loadMovies,
    reset,
  } = useFetch(() =>
    fetchMovies({
      query: query,
    })
  );

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim()) {
        await loadMovies();
      } else {
        reset();
      }
    }, 600);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <View className="flex-1 bg-primary">
      <View className="flex-1 bg-primary">
        <Image className="w-full z-o absolute " source={images.bg} />
        <View className="flex-1 px-5 h-full p-10">
          <SearchBar
            placeholder="Search for a movie"
            value={query}
            onChangeText={(text: string) => setQuery(text)}
          />

          {moviesLoading ? (
            <ActivityIndicator
              size="large"
              color={"#0000ff"}
              className="mt-10 self-center"
            />
          ) : moviesError ? (
            <Text className="text-white"> {moviesError.message} </Text>
          ) : (
            <View className="flex-1 mt-5">
              <>
                <View className="d-flex flex-row">
                  {!moviesLoading && !moviesError && query.trim() && movies?.length>0 && (<><Text className="font-bold text-white"> Search reults for </Text><Text className="font-bold text-light-300">{query}</Text></>)}
                </View>
                <FlatList
                  data={movies}
                  renderItem={({ item }) => <MovieCard {...item} />}
                  keyExtractor={(item) => item.id}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10,
                  }}
                  contentContainerStyle={{
                    paddingBottom: 100,
                  }}
                  className="mt-2 pb-32"
                  ListEmptyComponent={
                    !moviesLoading && !moviesError ? (
                      <View className="mt-10 px-5">
                        
                          {query.trim() ? (<Text className="text-light-200"> No movies found </Text>): <Text className="">Search</Text>}
                      </View>          
                    ) : null
                  }
                />
              </>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});
