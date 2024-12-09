package com.xdpsx.auction.util;

import java.util.*;

public class TFIDFCalculator {

    public static double calculateRelevance(String keyword, String[] nameWords, String[] descriptionWords,
                                            Map<String, Double> idfMap) {
        Map<String, Double> nameTFIDF = calculateTFIDF(nameWords, idfMap);
        Map<String, Double> descTFIDF = calculateTFIDF(descriptionWords, idfMap);

        double relevance = 0.0;
        for (String word : keyword.split("\\s+")) {
            relevance += 2.0 * nameTFIDF.getOrDefault(word, 0.0);
            relevance += descTFIDF.getOrDefault(word, 0.0);
        }

        return relevance;
    }

    public static Map<String, Double> calculateTFIDF(String[] words, Map<String, Double> idfMap) {
        Map<String, Double> tfMap = calculateTF(words);
        Map<String, Double> tfidfMap = new HashMap<>();

        for (String word : tfMap.keySet()) {
            double tfidf = tfMap.get(word) * idfMap.getOrDefault(word, 0.0);
            tfidfMap.put(word, tfidf);
        }

        return tfidfMap;
    }

    public static Map<String, Double> calculateTF(String[] words) {
        Map<String, Double> tfMap = new HashMap<>();
        int totalWords = words.length;

        for (String word : words) {
            tfMap.put(word, tfMap.getOrDefault(word, 0.0) + 1.0);
        }

        for (Map.Entry<String, Double> entry : tfMap.entrySet()) {
            tfMap.put(entry.getKey(), entry.getValue() / totalWords);
        }
//        tfMap.replaceAll((k, v) -> v / totalWords);

        return tfMap;
    }

    public static Map<String, Double> calculateIDF(List<String[]> documents) {
        Map<String, Double> idfMap = new HashMap<>();
        int totalDocuments = documents.size();

        for (String[] doc : documents) {
            Set<String> uniqueWords = new HashSet<>(Arrays.asList(doc));
            for (String word : uniqueWords) {
                idfMap.put(word, idfMap.getOrDefault(word, 0.0) + 1.0);
            }
        }

        for (Map.Entry<String, Double> entry : idfMap.entrySet()) {
            idfMap.put(entry.getKey(), Math.log(totalDocuments / (1 + entry.getValue())));
        }

        return idfMap;
    }
}
