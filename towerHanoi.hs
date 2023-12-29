main :: IO ()
main = do
    x <- getLine
    print $ map (\n -> (tower n)) (parseInts x)


tower :: Integer -> [(Integer,Integer)]
tower 1 = [(1,3)] 
tower n = (map towermap1 (tower (n-1))) ++ [(1,3)] ++ (map towermap2 (tower (n-1)))


towermap1 :: (Integer,Integer) -> (Integer,Integer)
towermap1 (2,3) = (3,2)
towermap1 (3,2) = (2,3)
towermap1 (2,1) = (3,1)
towermap1 (3,1) = (2,1)
towermap1 (1,2) = (1,3)
towermap1 (1,3) = (1,2)

towermap2 :: (Integer,Integer) -> (Integer,Integer)
towermap2 (2,3) = (1,3)
towermap2 (3,2) = (3,1)
towermap2 (2,1) = (1,2)
towermap2 (3,1) = (3,2)
towermap2 (1,2) = (2,1)
towermap2 (1,3) = (2,3)

parseInts :: String -> [Integer]
parseInts str = map read (words str)
