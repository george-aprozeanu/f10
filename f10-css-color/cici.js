const RAL = [[0, 15, 0],
    [0, 20, 0],
    [0, 25, 0],
    [0, 30, 0],
    [0, 35, 0],
    [0, 40, 0],
    [0, 45, 0],
    [0, 50, 0],
    [0, 55, 0],
    [0, 60, 0],
    [0, 65, 0],
    [0, 70, 0],
    [0, 75, 0],
    [0, 80, 0],
    [0, 85, 0],
    [0, 90, 0],
    [10, 20, 15],
    [10, 20, 20],
    [10, 20, 25],
    [10, 30, 15],
    [10, 30, 20],
    [10, 30, 25],
    [10, 30, 30],
    [10, 30, 35],
    [10, 30, 40],
    [10, 30, 44],
    [10, 40, 10],
    [10, 40, 15],
    [10, 40, 20],
    [10, 40, 25],
    [10, 40, 30],
    [10, 40, 35],
    [10, 40, 40],
    [10, 40, 45],
    [10, 40, 50],
    [10, 40, 53],
    [10, 50, 10],
    [10, 50, 15],
    [10, 50, 20],
    [10, 50, 25],
    [10, 50, 30],
    [10, 50, 35],
    [10, 50, 40],
    [10, 50, 45],
    [10, 50, 50],
    [10, 60, 10],
    [10, 60, 15],
    [10, 60, 20],
    [10, 60, 25],
    [10, 60, 30],
    [10, 60, 35],
    [10, 60, 40],
    [10, 60, 45],
    [10, 70, 10],
    [10, 70, 15],
    [10, 70, 20],
    [10, 70, 25],
    [10, 70, 30],
    [10, 70, 35],
    [10, 80, 10],
    [10, 80, 15],
    [10, 80, 20],
    [10, 90, 5],
    [10, 90, 10],
    [10, 92, 5],
    [20, 20, 5],
    [20, 20, 10],
    [20, 20, 20],
    [20, 20, 29],
    [20, 30, 5],
    [20, 30, 10],
    [20, 30, 20],
    [20, 30, 30],
    [20, 30, 40],
    [20, 30, 48],
    [20, 40, 5],
    [20, 40, 10],
    [20, 40, 20],
    [20, 40, 30],
    [20, 40, 40],
    [20, 40, 50],
    [20, 50, 5],
    [20, 50, 10],
    [20, 50, 20],
    [20, 50, 30],
    [20, 50, 40],
    [20, 50, 50],
    [20, 50, 58],
    [20, 60, 5],
    [20, 60, 10],
    [20, 60, 20],
    [20, 60, 30],
    [20, 60, 40],
    [20, 70, 5],
    [20, 70, 10],
    [20, 70, 20],
    [20, 70, 30],
    [20, 80, 5],
    [20, 80, 10],
    [20, 80, 20],
    [20, 90, 5],
    [20, 90, 10],
    [30, 30, 20],
    [30, 30, 30],
    [30, 30, 40],
    [30, 30, 45],
    [30, 40, 10],
    [30, 40, 20],
    [30, 40, 30],
    [30, 40, 40],
    [30, 40, 50],
    [30, 40, 60],
    [30, 50, 10],
    [30, 50, 20],
    [30, 50, 30],
    [30, 50, 40],
    [30, 50, 50],
    [30, 50, 60],
    [30, 60, 10],
    [30, 60, 20],
    [30, 60, 30],
    [30, 60, 40],
    [30, 60, 50],
    [30, 70, 10],
    [30, 70, 20],
    [30, 70, 30],
    [30, 70, 40],
    [30, 80, 10],
    [30, 80, 20],
    [30, 90, 5],
    [30, 90, 10],
    [40, 20, 19],
    [40, 30, 5],
    [40, 30, 10],
    [40, 30, 20],
    [40, 30, 30],
    [40, 30, 40],
    [40, 40, 5],
    [40, 40, 10],
    [40, 40, 20],
    [40, 40, 30],
    [40, 40, 40],
    [40, 40, 50],
    [40, 40, 60],
    [40, 40, 67],
    [40, 50, 5],
    [40, 50, 10],
    [40, 50, 20],
    [40, 50, 30],
    [40, 50, 40],
    [40, 50, 50],
    [40, 50, 60],
    [40, 50, 70],
    [40, 60, 5],
    [40, 60, 10],
    [40, 60, 20],
    [40, 60, 30],
    [40, 60, 40],
    [40, 60, 50],
    [40, 60, 60],
    [40, 70, 5],
    [40, 70, 10],
    [40, 70, 20],
    [40, 70, 30],
    [40, 70, 40],
    [40, 70, 50],
    [40, 80, 5],
    [40, 80, 10],
    [40, 80, 20],
    [40, 80, 30],
    [40, 90, 5],
    [40, 90, 10],
    [50, 20, 10],
    [50, 20, 16],
    [50, 30, 20],
    [50, 30, 30],
    [50, 30, 36],
    [50, 40, 10],
    [50, 40, 20],
    [50, 40, 30],
    [50, 40, 40],
    [50, 40, 50],
    [50, 50, 10],
    [50, 50, 20],
    [50, 50, 30],
    [50, 50, 40],
    [50, 50, 50],
    [50, 50, 60],
    [50, 50, 70],
    [50, 50, 78],
    [50, 60, 10],
    [50, 60, 20],
    [50, 60, 30],
    [50, 60, 40],
    [50, 60, 50],
    [50, 60, 60],
    [50, 60, 70],
    [50, 60, 80],
    [50, 70, 10],
    [50, 70, 20],
    [50, 70, 30],
    [50, 70, 40],
    [50, 70, 50],
    [50, 70, 60],
    [50, 80, 10],
    [50, 80, 20],
    [50, 80, 30],
    [50, 90, 5],
    [50, 90, 10],
    [50, 92, 5],
    [60, 20, 5],
    [60, 30, 5],
    [60, 30, 10],
    [60, 30, 20],
    [60, 30, 27],
    [60, 40, 5],
    [60, 40, 10],
    [60, 40, 20],
    [60, 40, 30],
    [60, 40, 40],
    [60, 50, 5],
    [60, 50, 10],
    [60, 50, 20],
    [60, 50, 30],
    [60, 50, 40],
    [60, 50, 50],
    [60, 50, 60],
    [60, 50, 70],
    [60, 60, 5],
    [60, 60, 10],
    [60, 60, 20],
    [60, 60, 30],
    [60, 60, 40],
    [60, 60, 50],
    [60, 60, 60],
    [60, 60, 70],
    [60, 60, 80],
    [60, 70, 5],
    [60, 70, 10],
    [60, 70, 20],
    [60, 70, 30],
    [60, 70, 40],
    [60, 70, 50],
    [60, 70, 60],
    [60, 70, 70],
    [60, 80, 10],
    [60, 80, 20],
    [60, 80, 30],
    [60, 80, 40],
    [60, 90, 5],
    [60, 90, 10],
    [60, 90, 15],
    [70, 30, 20],
    [70, 40, 10],
    [70, 40, 20],
    [70, 40, 30],
    [70, 40, 40],
    [70, 50, 10],
    [70, 50, 20],
    [70, 50, 30],
    [70, 50, 40],
    [70, 50, 50],
    [70, 50, 55],
    [70, 60, 10],
    [70, 60, 20],
    [70, 60, 30],
    [70, 60, 40],
    [70, 60, 50],
    [70, 60, 60],
    [70, 60, 70],
    [70, 60, 75],
    [70, 70, 10],
    [70, 70, 20],
    [70, 70, 30],
    [70, 70, 40],
    [70, 70, 50],
    [70, 70, 60],
    [70, 70, 70],
    [70, 70, 80],
    [70, 80, 10],
    [70, 80, 20],
    [70, 80, 30],
    [70, 80, 40],
    [70, 80, 50],
    [70, 80, 60],
    [70, 90, 5],
    [70, 90, 10],
    [70, 90, 20],
    [75, 40, 20],
    [75, 40, 30],
    [75, 40, 38],
    [75, 50, 20],
    [75, 50, 30],
    [75, 50, 40],
    [75, 50, 50],
    [75, 50, 58],
    [75, 60, 10],
    [75, 60, 20],
    [75, 60, 30],
    [75, 60, 40],
    [75, 60, 50],
    [75, 60, 60],
    [75, 60, 70],
    [75, 70, 10],
    [75, 70, 20],
    [75, 70, 30],
    [75, 70, 40],
    [75, 70, 50],
    [75, 70, 60],
    [75, 70, 70],
    [75, 70, 80],
    [75, 80, 10],
    [75, 80, 20],
    [75, 80, 30],
    [75, 80, 40],
    [75, 80, 50],
    [75, 80, 60],
    [75, 90, 10],
    [75, 90, 20],
    [75, 92, 5],
    [80, 20, 10],
    [80, 30, 5],
    [80, 30, 10],
    [80, 30, 20],
    [80, 30, 26],
    [80, 40, 5],
    [80, 40, 10],
    [80, 40, 20],
    [80, 40, 30],
    [80, 40, 40],
    [80, 50, 5],
    [80, 50, 10],
    [80, 50, 20],
    [80, 50, 30],
    [80, 50, 40],
    [80, 50, 50],
    [80, 60, 5],
    [80, 60, 10],
    [80, 60, 20],
    [80, 60, 30],
    [80, 60, 40],
    [80, 60, 50],
    [80, 60, 60],
    [80, 60, 70],
    [80, 70, 10],
    [80, 70, 20],
    [80, 70, 30],
    [80, 70, 40],
    [80, 70, 50],
    [80, 70, 60],
    [80, 70, 70],
    [80, 70, 80],
    [80, 70, 88],
    [80, 80, 5],
    [80, 80, 10],
    [80, 80, 20],
    [80, 80, 30],
    [80, 80, 40],
    [80, 80, 50],
    [80, 80, 60],
    [80, 80, 70],
    [80, 80, 80],
    [80, 80, 90],
    [80, 90, 5],
    [80, 90, 10],
    [80, 90, 20],
    [85, 40, 20],
    [85, 40, 30],
    [85, 50, 20],
    [85, 50, 30],
    [85, 50, 40],
    [85, 50, 50],
    [85, 60, 10],
    [85, 60, 20],
    [85, 60, 30],
    [85, 60, 40],
    [85, 60, 50],
    [85, 60, 60],
    [85, 70, 10],
    [85, 70, 20],
    [85, 70, 30],
    [85, 70, 40],
    [85, 70, 50],
    [85, 70, 60],
    [85, 70, 70],
    [85, 70, 75],
    [85, 80, 10],
    [85, 80, 20],
    [85, 80, 30],
    [85, 80, 40],
    [85, 80, 50],
    [85, 80, 60],
    [85, 80, 70],
    [85, 80, 80],
    [85, 80, 85],
    [85, 90, 10],
    [85, 90, 20],
    [85, 90, 30],
    [90, 30, 20],
    [90, 40, 10],
    [90, 40, 20],
    [90, 40, 30],
    [90, 50, 10],
    [90, 50, 20],
    [90, 50, 30],
    [90, 50, 40],
    [90, 60, 10],
    [90, 60, 20],
    [90, 60, 30],
    [90, 60, 40],
    [90, 60, 50],
    [90, 60, 60],
    [90, 70, 10],
    [90, 70, 20],
    [90, 70, 30],
    [90, 70, 40],
    [90, 70, 50],
    [90, 70, 60],
    [90, 70, 70],
    [90, 70, 80],
    [90, 80, 10],
    [90, 80, 20],
    [90, 80, 30],
    [90, 80, 40],
    [90, 80, 50],
    [90, 80, 60],
    [90, 80, 70],
    [90, 80, 80],
    [90, 80, 90],
    [90, 90, 5],
    [90, 90, 10],
    [90, 90, 20],
    [90, 90, 30],
    [95, 40, 20],
    [95, 40, 30],
    [95, 50, 20],
    [95, 50, 30],
    [95, 50, 40],
    [95, 50, 50],
    [95, 60, 10],
    [95, 60, 20],
    [95, 60, 30],
    [95, 60, 40],
    [95, 60, 50],
    [95, 60, 60],
    [95, 60, 70],
    [95, 70, 10],
    [95, 70, 20],
    [95, 70, 30],
    [95, 70, 40],
    [95, 70, 50],
    [95, 70, 60],
    [95, 70, 70],
    [95, 80, 10],
    [95, 80, 20],
    [95, 80, 30],
    [95, 80, 40],
    [95, 80, 50],
    [95, 80, 60],
    [95, 80, 70],
    [95, 80, 80],
    [95, 90, 10],
    [95, 90, 20],
    [95, 90, 30],
    [95, 90, 40],
    [95, 90, 50],
    [95, 90, 59],
    [100, 20, 5],
    [100, 30, 5],
    [100, 30, 10],
    [100, 30, 20],
    [100, 40, 5],
    [100, 40, 10],
    [100, 40, 20],
    [100, 40, 30],
    [100, 40, 40],
    [100, 50, 5],
    [100, 50, 10],
    [100, 50, 20],
    [100, 50, 30],
    [100, 50, 40],
    [100, 50, 50],
    [100, 60, 5],
    [100, 60, 10],
    [100, 60, 20],
    [100, 60, 30],
    [100, 60, 40],
    [100, 60, 50],
    [100, 60, 60],
    [100, 70, 5],
    [100, 70, 10],
    [100, 70, 20],
    [100, 70, 30],
    [100, 70, 40],
    [100, 70, 50],
    [100, 70, 60],
    [100, 80, 5],
    [100, 80, 10],
    [100, 80, 20],
    [100, 80, 30],
    [100, 80, 40],
    [100, 80, 50],
    [100, 80, 60],
    [100, 80, 70],
    [100, 80, 80],
    [100, 90, 5],
    [100, 90, 10],
    [100, 90, 20],
    [100, 90, 30],
    [100, 90, 40],
    [100, 90, 50],
    [110, 20, 10],
    [110, 30, 20],
    [110, 40, 10],
    [110, 40, 20],
    [110, 40, 30],
    [110, 40, 40],
    [110, 50, 10],
    [110, 50, 20],
    [110, 50, 30],
    [110, 50, 40],
    [110, 50, 50],
    [110, 50, 55],
    [110, 60, 10],
    [110, 60, 20],
    [110, 60, 30],
    [110, 60, 40],
    [110, 60, 50],
    [110, 60, 60],
    [110, 60, 65],
    [110, 70, 10],
    [110, 70, 20],
    [110, 70, 30],
    [110, 70, 40],
    [110, 70, 50],
    [110, 70, 60],
    [110, 70, 70],
    [110, 70, 77],
    [110, 80, 10],
    [110, 80, 20],
    [110, 80, 30],
    [110, 80, 40],
    [110, 80, 50],
    [110, 80, 60],
    [110, 80, 70],
    [110, 90, 5],
    [110, 90, 10],
    [110, 90, 20],
    [110, 90, 30],
    [110, 90, 35],
    [110, 90, 40],
    [110, 92, 5],
    [120, 30, 5],
    [120, 30, 10],
    [120, 30, 20],
    [120, 40, 5],
    [120, 40, 10],
    [120, 40, 20],
    [120, 40, 30],
    [120, 40, 40],
    [120, 50, 5],
    [120, 50, 10],
    [120, 50, 20],
    [120, 50, 30],
    [120, 50, 40],
    [120, 50, 50],
    [120, 60, 5],
    [120, 60, 10],
    [120, 60, 20],
    [120, 60, 30],
    [120, 60, 40],
    [120, 60, 50],
    [120, 60, 60],
    [120, 60, 63],
    [120, 70, 5],
    [120, 70, 10],
    [120, 70, 20],
    [120, 70, 30],
    [120, 70, 40],
    [120, 70, 50],
    [120, 70, 60],
    [120, 70, 70],
    [120, 70, 75],
    [120, 80, 5],
    [120, 80, 10],
    [120, 80, 20],
    [120, 80, 30],
    [120, 80, 40],
    [120, 80, 50],
    [120, 80, 60],
    [120, 90, 5],
    [120, 90, 10],
    [120, 90, 20],
    [120, 90, 30],
    [130, 30, 20],
    [130, 40, 10],
    [130, 40, 20],
    [130, 40, 30],
    [130, 50, 10],
    [130, 50, 20],
    [130, 50, 30],
    [130, 50, 40],
    [130, 50, 50],
    [130, 60, 10],
    [130, 60, 20],
    [130, 60, 30],
    [130, 60, 40],
    [130, 60, 50],
    [130, 60, 60],
    [130, 70, 10],
    [130, 70, 20],
    [130, 70, 30],
    [130, 70, 40],
    [130, 70, 50],
    [130, 70, 60],
    [130, 80, 10],
    [130, 80, 20],
    [130, 80, 30],
    [130, 80, 40],
    [130, 80, 50],
    [130, 90, 5],
    [130, 90, 10],
    [130, 90, 20],
    [130, 92, 5],
    [140, 20, 5],
    [140, 20, 10],
    [140, 20, 20],
    [140, 30, 5],
    [140, 30, 10],
    [140, 30, 20],
    [140, 30, 30],
    [140, 30, 40],
    [140, 40, 5],
    [140, 40, 10],
    [140, 40, 20],
    [140, 40, 30],
    [140, 40, 40],
    [140, 40, 50],
    [140, 50, 5],
    [140, 50, 10],
    [140, 50, 20],
    [140, 50, 30],
    [140, 50, 40],
    [140, 50, 50],
    [140, 50, 60],
    [140, 60, 5],
    [140, 60, 10],
    [140, 60, 20],
    [140, 60, 30],
    [140, 60, 40],
    [140, 60, 50],
    [140, 60, 60],
    [140, 60, 70],
    [140, 70, 5],
    [140, 70, 10],
    [140, 70, 20],
    [140, 70, 30],
    [140, 70, 40],
    [140, 70, 50],
    [140, 70, 60],
    [140, 80, 10],
    [140, 80, 20],
    [140, 80, 30],
    [140, 80, 40],
    [140, 90, 5],
    [140, 90, 10],
    [150, 30, 20],
    [150, 30, 30],
    [150, 40, 10],
    [150, 40, 20],
    [150, 40, 30],
    [150, 40, 40],
    [150, 40, 50],
    [150, 50, 10],
    [150, 50, 20],
    [150, 50, 30],
    [150, 50, 40],
    [150, 50, 50],
    [150, 50, 60],
    [150, 60, 10],
    [150, 60, 20],
    [150, 60, 30],
    [150, 60, 40],
    [150, 60, 50],
    [150, 60, 60],
    [150, 70, 10],
    [150, 70, 20],
    [150, 70, 30],
    [150, 70, 40],
    [150, 70, 50],
    [150, 80, 10],
    [150, 80, 20],
    [150, 80, 30],
    [150, 80, 40],
    [150, 90, 5],
    [150, 90, 10],
    [160, 20, 15],
    [160, 20, 20],
    [160, 30, 5],
    [160, 30, 10],
    [160, 30, 15],
    [160, 30, 20],
    [160, 30, 25],
    [160, 30, 30],
    [160, 30, 35],
    [160, 30, 38],
    [160, 40, 5],
    [160, 40, 10],
    [160, 40, 15],
    [160, 40, 20],
    [160, 40, 25],
    [160, 40, 30],
    [160, 40, 35],
    [160, 40, 40],
    [160, 40, 45],
    [160, 40, 50],
    [160, 40, 55],
    [160, 50, 5],
    [160, 50, 10],
    [160, 50, 15],
    [160, 50, 20],
    [160, 50, 25],
    [160, 50, 30],
    [160, 50, 35],
    [160, 50, 40],
    [160, 50, 45],
    [160, 50, 50],
    [160, 50, 55],
    [160, 50, 60],
    [160, 60, 5],
    [160, 60, 10],
    [160, 60, 15],
    [160, 60, 20],
    [160, 60, 25],
    [160, 60, 30],
    [160, 60, 35],
    [160, 60, 40],
    [160, 60, 45],
    [160, 60, 50],
    [160, 60, 55],
    [160, 60, 58],
    [160, 70, 5],
    [160, 70, 10],
    [160, 70, 15],
    [160, 70, 20],
    [160, 70, 25],
    [160, 70, 30],
    [160, 70, 35],
    [160, 70, 40],
    [160, 70, 45],
    [160, 70, 49],
    [160, 80, 5],
    [160, 80, 10],
    [160, 80, 15],
    [160, 80, 20],
    [160, 80, 25],
    [160, 80, 30],
    [160, 90, 5],
    [160, 90, 10],
    [170, 20, 10],
    [170, 20, 20],
    [170, 20, 25],
    [170, 30, 15],
    [170, 30, 20],
    [170, 30, 25],
    [170, 30, 30],
    [170, 30, 35],
    [170, 30, 40],
    [170, 40, 10],
    [170, 40, 15],
    [170, 40, 20],
    [170, 40, 25],
    [170, 40, 30],
    [170, 40, 35],
    [170, 40, 40],
    [170, 40, 45],
    [170, 40, 50],
    [170, 50, 10],
    [170, 50, 15],
    [170, 50, 20],
    [170, 50, 25],
    [170, 50, 30],
    [170, 50, 35],
    [170, 50, 40],
    [170, 50, 45],
    [170, 50, 50],
    [170, 50, 55],
    [170, 60, 10],
    [170, 60, 15],
    [170, 60, 20],
    [170, 60, 25],
    [170, 60, 30],
    [170, 60, 35],
    [170, 60, 40],
    [170, 60, 45],
    [170, 60, 50],
    [170, 70, 10],
    [170, 70, 15],
    [170, 70, 20],
    [170, 70, 25],
    [170, 70, 30],
    [170, 70, 35],
    [170, 70, 40],
    [170, 80, 10],
    [170, 80, 15],
    [170, 80, 20],
    [170, 80, 25],
    [170, 90, 5],
    [170, 90, 10],
    [170, 92, 5],
    [180, 20, 5],
    [180, 20, 15],
    [180, 20, 20],
    [180, 30, 5],
    [180, 30, 10],
    [180, 30, 15],
    [180, 30, 20],
    [180, 30, 25],
    [180, 30, 30],
    [180, 30, 35],
    [180, 40, 5],
    [180, 40, 10],
    [180, 40, 15],
    [180, 40, 20],
    [180, 40, 25],
    [180, 40, 30],
    [180, 40, 35],
    [180, 40, 40],
    [180, 40, 45],
    [180, 50, 5],
    [180, 50, 10],
    [180, 50, 15],
    [180, 50, 20],
    [180, 50, 25],
    [180, 50, 30],
    [180, 50, 35],
    [180, 50, 40],
    [180, 50, 45],
    [180, 50, 50],
    [180, 60, 5],
    [180, 60, 10],
    [180, 60, 15],
    [180, 60, 20],
    [180, 60, 25],
    [180, 60, 30],
    [180, 60, 35],
    [180, 60, 40],
    [180, 60, 45],
    [180, 60, 50],
    [180, 70, 5],
    [180, 70, 10],
    [180, 70, 15],
    [180, 70, 20],
    [180, 70, 25],
    [180, 70, 30],
    [180, 70, 35],
    [180, 70, 40],
    [180, 80, 5],
    [180, 80, 10],
    [180, 80, 15],
    [180, 80, 20],
    [180, 80, 25],
    [180, 80, 30],
    [180, 90, 5],
    [180, 90, 10],
    [190, 20, 20],
    [190, 30, 15],
    [190, 30, 20],
    [190, 30, 25],
    [190, 30, 30],
    [190, 30, 35],
    [190, 40, 10],
    [190, 40, 15],
    [190, 40, 20],
    [190, 40, 25],
    [190, 40, 30],
    [190, 40, 35],
    [190, 40, 40],
    [190, 40, 45],
    [190, 50, 10],
    [190, 50, 15],
    [190, 50, 20],
    [190, 50, 25],
    [190, 50, 30],
    [190, 50, 35],
    [190, 50, 40],
    [190, 50, 45],
    [190, 60, 10],
    [190, 60, 15],
    [190, 60, 20],
    [190, 60, 25],
    [190, 60, 30],
    [190, 60, 35],
    [190, 60, 40],
    [190, 60, 45],
    [190, 70, 10],
    [190, 70, 15],
    [190, 70, 20],
    [190, 70, 25],
    [190, 70, 30],
    [190, 70, 35],
    [190, 80, 10],
    [190, 80, 15],
    [190, 80, 20],
    [190, 80, 25],
    [190, 90, 5],
    [190, 90, 10],
    [200, 20, 10],
    [200, 20, 15],
    [200, 20, 20],
    [200, 20, 23],
    [200, 30, 5],
    [200, 30, 10],
    [200, 30, 15],
    [200, 30, 20],
    [200, 30, 25],
    [200, 30, 30],
    [200, 30, 33],
    [200, 40, 5],
    [200, 40, 10],
    [200, 40, 15],
    [200, 40, 20],
    [200, 40, 25],
    [200, 40, 30],
    [200, 40, 35],
    [200, 40, 40],
    [200, 50, 5],
    [200, 50, 10],
    [200, 50, 15],
    [200, 50, 20],
    [200, 50, 25],
    [200, 50, 30],
    [200, 50, 35],
    [200, 50, 40],
    [200, 50, 45],
    [200, 60, 5],
    [200, 60, 10],
    [200, 60, 15],
    [200, 60, 20],
    [200, 60, 25],
    [200, 60, 30],
    [200, 60, 35],
    [200, 60, 40],
    [200, 70, 5],
    [200, 70, 10],
    [200, 70, 15],
    [200, 70, 20],
    [200, 70, 25],
    [200, 80, 5],
    [200, 80, 10],
    [200, 80, 15],
    [200, 80, 20],
    [200, 80, 25],
    [200, 90, 5],
    [200, 90, 10],
    [200, 92, 5],
    [210, 30, 15],
    [210, 30, 20],
    [210, 30, 25],
    [210, 30, 30],
    [210, 40, 10],
    [210, 40, 15],
    [210, 40, 20],
    [210, 40, 25],
    [210, 40, 30],
    [210, 40, 35],
    [210, 40, 38],
    [210, 50, 10],
    [210, 50, 15],
    [210, 50, 20],
    [210, 50, 25],
    [210, 50, 30],
    [210, 50, 35],
    [210, 50, 40],
    [210, 50, 45],
    [210, 60, 10],
    [210, 60, 15],
    [210, 60, 20],
    [210, 60, 25],
    [210, 60, 30],
    [210, 60, 35],
    [210, 60, 40],
    [210, 70, 10],
    [210, 70, 15],
    [210, 70, 20],
    [210, 70, 25],
    [210, 70, 30],
    [210, 70, 35],
    [210, 80, 10],
    [210, 80, 15],
    [210, 80, 20],
    [210, 80, 25],
    [210, 90, 5],
    [210, 90, 10],
    [220, 20, 5],
    [220, 20, 15],
    [220, 20, 20],
    [220, 30, 5],
    [220, 30, 10],
    [220, 30, 15],
    [220, 30, 20],
    [220, 30, 25],
    [220, 30, 30],
    [220, 40, 5],
    [220, 40, 10],
    [220, 40, 15],
    [220, 40, 20],
    [220, 40, 25],
    [220, 40, 30],
    [220, 40, 35],
    [220, 40, 40],
    [220, 50, 5],
    [220, 50, 10],
    [220, 50, 15],
    [220, 50, 20],
    [220, 50, 25],
    [220, 50, 30],
    [220, 50, 35],
    [220, 50, 40],
    [220, 60, 5],
    [220, 60, 10],
    [220, 60, 15],
    [220, 60, 20],
    [220, 60, 25],
    [220, 60, 30],
    [220, 60, 35],
    [220, 60, 40],
    [220, 70, 5],
    [220, 70, 10],
    [220, 70, 15],
    [220, 70, 20],
    [220, 70, 25],
    [220, 70, 30],
    [220, 70, 35],
    [220, 80, 5],
    [220, 80, 10],
    [220, 80, 15],
    [220, 80, 20],
    [220, 80, 25],
    [220, 90, 5],
    [220, 92, 5],
    [230, 20, 10],
    [230, 20, 20],
    [230, 30, 15],
    [230, 30, 20],
    [230, 30, 25],
    [230, 40, 10],
    [230, 40, 15],
    [230, 40, 20],
    [230, 40, 25],
    [230, 40, 30],
    [230, 40, 35],
    [230, 40, 40],
    [230, 50, 10],
    [230, 50, 15],
    [230, 50, 20],
    [230, 50, 25],
    [230, 50, 30],
    [230, 50, 35],
    [230, 50, 40],
    [230, 60, 10],
    [230, 60, 15],
    [230, 60, 20],
    [230, 60, 25],
    [230, 60, 30],
    [230, 60, 35],
    [230, 60, 40],
    [230, 70, 10],
    [230, 70, 15],
    [230, 70, 20],
    [230, 70, 25],
    [230, 70, 30],
    [230, 80, 10],
    [230, 80, 15],
    [230, 80, 20],
    [230, 90, 5],
    [240, 20, 15],
    [240, 20, 20],
    [240, 20, 22],
    [240, 30, 5],
    [240, 30, 10],
    [240, 30, 15],
    [240, 30, 20],
    [240, 30, 25],
    [240, 30, 30],
    [240, 30, 35],
    [240, 40, 5],
    [240, 40, 10],
    [240, 40, 15],
    [240, 40, 20],
    [240, 40, 25],
    [240, 40, 30],
    [240, 40, 35],
    [240, 40, 40],
    [240, 50, 5],
    [240, 50, 10],
    [240, 50, 15],
    [240, 50, 20],
    [240, 50, 25],
    [240, 50, 30],
    [240, 50, 35],
    [240, 50, 40],
    [240, 60, 5],
    [240, 60, 10],
    [240, 60, 15],
    [240, 60, 20],
    [240, 60, 25],
    [240, 60, 30],
    [240, 60, 35],
    [240, 60, 40],
    [240, 70, 5],
    [240, 70, 10],
    [240, 70, 15],
    [240, 70, 20],
    [240, 70, 25],
    [240, 70, 30],
    [240, 80, 5],
    [240, 80, 10],
    [240, 80, 15],
    [240, 80, 20],
    [240, 90, 5],
    [250, 20, 20],
    [250, 20, 25],
    [250, 30, 15],
    [250, 30, 20],
    [250, 30, 25],
    [250, 30, 30],
    [250, 40, 10],
    [250, 40, 15],
    [250, 40, 20],
    [250, 40, 25],
    [250, 40, 30],
    [250, 40, 35],
    [250, 40, 40],
    [250, 50, 10],
    [250, 50, 15],
    [250, 50, 20],
    [250, 50, 25],
    [250, 50, 30],
    [250, 50, 35],
    [250, 50, 40],
    [250, 60, 10],
    [250, 60, 15],
    [250, 60, 20],
    [250, 60, 25],
    [250, 60, 30],
    [250, 60, 35],
    [250, 60, 40],
    [250, 70, 10],
    [250, 70, 15],
    [250, 70, 20],
    [250, 70, 25],
    [250, 70, 30],
    [250, 80, 10],
    [250, 80, 15],
    [250, 80, 20],
    [250, 90, 5],
    [250, 92, 5],
    [260, 20, 5],
    [260, 20, 10],
    [260, 20, 15],
    [260, 20, 20],
    [260, 30, 5],
    [260, 30, 10],
    [260, 30, 15],
    [260, 30, 20],
    [260, 30, 25],
    [260, 30, 30],
    [260, 30, 35],
    [260, 40, 5],
    [260, 40, 10],
    [260, 40, 15],
    [260, 40, 20],
    [260, 40, 25],
    [260, 40, 30],
    [260, 40, 35],
    [260, 40, 40],
    [260, 40, 45],
    [260, 50, 5],
    [260, 50, 10],
    [260, 50, 15],
    [260, 50, 20],
    [260, 50, 25],
    [260, 50, 30],
    [260, 50, 35],
    [260, 50, 40],
    [260, 60, 5],
    [260, 60, 10],
    [260, 60, 15],
    [260, 60, 20],
    [260, 60, 25],
    [260, 60, 30],
    [260, 60, 35],
    [260, 70, 5],
    [260, 70, 10],
    [260, 70, 15],
    [260, 70, 20],
    [260, 70, 25],
    [260, 80, 5],
    [260, 80, 10],
    [260, 80, 15],
    [260, 90, 5],
    [270, 20, 20],
    [270, 20, 25],
    [270, 20, 29],
    [270, 30, 15],
    [270, 30, 20],
    [270, 30, 25],
    [270, 30, 30],
    [270, 30, 35],
    [270, 30, 40],
    [270, 40, 15],
    [270, 40, 20],
    [270, 40, 25],
    [270, 40, 30],
    [270, 40, 35],
    [270, 40, 40],
    [270, 50, 10],
    [270, 50, 15],
    [270, 50, 20],
    [270, 50, 25],
    [270, 50, 30],
    [270, 50, 35],
    [270, 50, 40],
    [270, 60, 10],
    [270, 60, 15],
    [270, 60, 20],
    [270, 60, 25],
    [270, 60, 30],
    [270, 60, 35],
    [270, 70, 10],
    [270, 70, 15],
    [270, 70, 20],
    [270, 70, 25],
    [270, 80, 10],
    [270, 80, 15],
    [270, 90, 5],
    [280, 20, 15],
    [280, 20, 20],
    [280, 20, 25],
    [280, 20, 30],
    [280, 30, 5],
    [280, 30, 10],
    [280, 30, 15],
    [280, 30, 20],
    [280, 30, 25],
    [280, 30, 30],
    [280, 30, 35],
    [280, 30, 40],
    [280, 40, 5],
    [280, 40, 10],
    [280, 40, 15],
    [280, 40, 20],
    [280, 40, 25],
    [280, 40, 30],
    [280, 40, 35],
    [280, 40, 40],
    [280, 40, 45],
    [280, 50, 5],
    [280, 50, 10],
    [280, 50, 15],
    [280, 50, 20],
    [280, 50, 25],
    [280, 50, 30],
    [280, 50, 35],
    [280, 50, 40],
    [280, 60, 5],
    [280, 60, 10],
    [280, 60, 15],
    [280, 60, 20],
    [280, 60, 25],
    [280, 60, 30],
    [280, 60, 35],
    [280, 70, 5],
    [280, 70, 10],
    [280, 70, 15],
    [280, 70, 20],
    [280, 70, 25],
    [280, 80, 5],
    [280, 80, 10],
    [280, 80, 15],
    [280, 90, 5],
    [290, 20, 10],
    [290, 20, 20],
    [290, 20, 25],
    [290, 20, 30],
    [290, 20, 35],
    [290, 30, 15],
    [290, 30, 20],
    [290, 30, 25],
    [290, 30, 30],
    [290, 30, 35],
    [290, 30, 40],
    [290, 40, 10],
    [290, 40, 15],
    [290, 40, 20],
    [290, 40, 25],
    [290, 40, 30],
    [290, 40, 35],
    [290, 40, 40],
    [290, 40, 45],
    [290, 50, 10],
    [290, 50, 15],
    [290, 50, 20],
    [290, 50, 25],
    [290, 50, 30],
    [290, 50, 35],
    [290, 50, 40],
    [290, 60, 10],
    [290, 60, 15],
    [290, 60, 20],
    [290, 60, 25],
    [290, 60, 30],
    [290, 60, 35],
    [290, 70, 10],
    [290, 70, 15],
    [290, 70, 20],
    [290, 70, 25],
    [290, 80, 10],
    [290, 80, 15],
    [290, 90, 5],
    [290, 92, 5],
    [300, 20, 5],
    [300, 20, 15],
    [300, 20, 20],
    [300, 20, 25],
    [300, 20, 30],
    [300, 30, 5],
    [300, 30, 10],
    [300, 30, 15],
    [300, 30, 20],
    [300, 30, 25],
    [300, 30, 30],
    [300, 30, 35],
    [300, 30, 40],
    [300, 40, 5],
    [300, 40, 10],
    [300, 40, 15],
    [300, 40, 20],
    [300, 40, 25],
    [300, 40, 30],
    [300, 40, 35],
    [300, 40, 40],
    [300, 40, 45],
    [300, 50, 5],
    [300, 50, 10],
    [300, 50, 15],
    [300, 50, 20],
    [300, 50, 25],
    [300, 50, 30],
    [300, 50, 35],
    [300, 50, 40],
    [300, 60, 5],
    [300, 60, 10],
    [300, 60, 15],
    [300, 60, 20],
    [300, 60, 25],
    [300, 60, 30],
    [300, 60, 35],
    [300, 70, 5],
    [300, 70, 10],
    [300, 70, 15],
    [300, 70, 20],
    [300, 70, 25],
    [300, 80, 5],
    [300, 80, 10],
    [300, 80, 15],
    [300, 90, 5],
    [310, 20, 20],
    [310, 20, 25],
    [310, 20, 30],
    [310, 30, 15],
    [310, 30, 20],
    [310, 30, 25],
    [310, 30, 30],
    [310, 30, 35],
    [310, 30, 40],
    [310, 40, 10],
    [310, 40, 15],
    [310, 40, 20],
    [310, 40, 25],
    [310, 40, 30],
    [310, 40, 35],
    [310, 40, 40],
    [310, 50, 10],
    [310, 50, 15],
    [310, 50, 20],
    [310, 50, 25],
    [310, 50, 30],
    [310, 50, 35],
    [310, 50, 40],
    [310, 60, 10],
    [310, 60, 15],
    [310, 60, 20],
    [310, 60, 25],
    [310, 60, 30],
    [310, 60, 35],
    [310, 70, 10],
    [310, 70, 15],
    [310, 70, 20],
    [310, 70, 25],
    [310, 80, 10],
    [310, 80, 15],
    [310, 90, 5],
    [320, 20, 10],
    [320, 20, 15],
    [320, 20, 20],
    [320, 20, 25],
    [320, 30, 5],
    [320, 30, 10],
    [320, 30, 15],
    [320, 30, 20],
    [320, 30, 25],
    [320, 30, 30],
    [320, 30, 35],
    [320, 30, 37],
    [320, 40, 5],
    [320, 40, 10],
    [320, 40, 15],
    [320, 40, 20],
    [320, 40, 25],
    [320, 40, 30],
    [320, 40, 35],
    [320, 40, 40],
    [320, 50, 5],
    [320, 50, 10],
    [320, 50, 15],
    [320, 50, 20],
    [320, 50, 25],
    [320, 50, 30],
    [320, 50, 35],
    [320, 50, 39],
    [320, 60, 5],
    [320, 60, 10],
    [320, 60, 15],
    [320, 60, 20],
    [320, 60, 25],
    [320, 60, 30],
    [320, 60, 35],
    [320, 70, 5],
    [320, 70, 10],
    [320, 70, 15],
    [320, 70, 20],
    [320, 70, 25],
    [320, 80, 5],
    [320, 80, 10],
    [320, 80, 15],
    [320, 90, 5],
    [330, 20, 20],
    [330, 20, 25],
    [330, 30, 15],
    [330, 30, 20],
    [330, 30, 25],
    [330, 30, 30],
    [330, 30, 35],
    [330, 30, 40],
    [330, 40, 10],
    [330, 40, 15],
    [330, 40, 20],
    [330, 40, 25],
    [330, 40, 30],
    [330, 40, 35],
    [330, 40, 40],
    [330, 40, 45],
    [330, 50, 10],
    [330, 50, 15],
    [330, 50, 20],
    [330, 50, 25],
    [330, 50, 30],
    [330, 50, 35],
    [330, 50, 40],
    [330, 60, 10],
    [330, 60, 15],
    [330, 60, 20],
    [330, 60, 25],
    [330, 60, 30],
    [330, 60, 35],
    [330, 60, 40],
    [330, 70, 10],
    [330, 70, 15],
    [330, 70, 20],
    [330, 70, 25],
    [330, 70, 30],
    [330, 80, 10],
    [330, 80, 15],
    [330, 80, 20],
    [330, 90, 5],
    [340, 20, 5],
    [340, 20, 15],
    [340, 20, 20],
    [340, 20, 25],
    [340, 30, 5],
    [340, 30, 10],
    [340, 30, 15],
    [340, 30, 20],
    [340, 30, 25],
    [340, 30, 30],
    [340, 30, 35],
    [340, 30, 40],
    [340, 40, 5],
    [340, 40, 10],
    [340, 40, 15],
    [340, 40, 20],
    [340, 40, 25],
    [340, 40, 30],
    [340, 40, 35],
    [340, 40, 40],
    [340, 40, 45],
    [340, 50, 5],
    [340, 50, 10],
    [340, 50, 15],
    [340, 50, 20],
    [340, 50, 25],
    [340, 50, 30],
    [340, 50, 35],
    [340, 50, 40],
    [340, 50, 45],
    [340, 60, 5],
    [340, 60, 10],
    [340, 60, 15],
    [340, 60, 20],
    [340, 60, 25],
    [340, 60, 30],
    [340, 60, 35],
    [340, 60, 40],
    [340, 70, 5],
    [340, 70, 10],
    [340, 70, 15],
    [340, 70, 20],
    [340, 70, 25],
    [340, 70, 30],
    [340, 70, 35],
    [340, 80, 5],
    [340, 80, 10],
    [340, 80, 15],
    [340, 80, 20],
    [340, 90, 5],
    [340, 92, 5],
    [350, 20, 10],
    [350, 20, 20],
    [350, 20, 25],
    [350, 20, 30],
    [350, 30, 15],
    [350, 30, 20],
    [350, 30, 25],
    [350, 30, 30],
    [350, 30, 35],
    [350, 30, 40],
    [350, 40, 10],
    [350, 40, 15],
    [350, 40, 20],
    [350, 40, 25],
    [350, 40, 30],
    [350, 40, 35],
    [350, 40, 40],
    [350, 40, 45],
    [350, 40, 50],
    [350, 50, 10],
    [350, 50, 15],
    [350, 50, 20],
    [350, 50, 25],
    [350, 50, 30],
    [350, 50, 35],
    [350, 50, 40],
    [350, 50, 45],
    [350, 50, 50],
    [350, 60, 10],
    [350, 60, 15],
    [350, 60, 20],
    [350, 60, 25],
    [350, 60, 30],
    [350, 60, 35],
    [350, 60, 40],
    [350, 60, 45],
    [350, 70, 10],
    [350, 70, 15],
    [350, 70, 20],
    [350, 70, 25],
    [350, 70, 30],
    [350, 70, 35],
    [350, 80, 10],
    [350, 80, 15],
    [350, 80, 20],
    [350, 90, 5],
    [360, 20, 15],
    [360, 30, 5],
    [360, 30, 10],
    [360, 30, 15],
    [360, 30, 20],
    [360, 30, 25],
    [360, 30, 30],
    [360, 30, 35],
    [360, 30, 40],
    [360, 40, 5],
    [360, 40, 10],
    [360, 40, 15],
    [360, 40, 20],
    [360, 40, 25],
    [360, 40, 30],
    [360, 40, 35],
    [360, 40, 40],
    [360, 40, 45],
    [360, 40, 50],
    [360, 50, 5],
    [360, 50, 10],
    [360, 50, 15],
    [360, 50, 20],
    [360, 50, 25],
    [360, 50, 30],
    [360, 50, 35],
    [360, 50, 40],
    [360, 50, 45],
    [360, 50, 50],
    [360, 60, 5],
    [360, 60, 10],
    [360, 60, 15],
    [360, 60, 20],
    [360, 60, 25],
    [360, 70, 5],
    [360, 70, 10],
    [360, 70, 15],
    [360, 80, 5],
    [360, 80, 10],
    [360, 90, 5],
    [360, 92, 5],
];

function* g(ral) {
    let gH = -1;
    let gL = -1;
    let g = [];
    let out = {};
    for (let [H, L, c] of ral) {
        if (L !== gL) {
            if (g.length) out[gL] = g;
            g = [];
            gL = L;
        }
        if (H !== gH) {
            if (Object.keys(out).length) yield {[gH]: out};
            out = {};
            gH = H;
        }
        g.push(c);
    }
    out[gL] = g;
    yield {[gH]: out};
}

console.log(JSON.stringify(Array.from(g(RAL)).reduce((map, entry) => Object.assign(map, entry)), undefined, 2));