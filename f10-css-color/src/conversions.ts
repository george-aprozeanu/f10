import * as math from "mathjs";

export type V3 = [number, number, number];
export type V2 = [number, number];
export type V = V2 | V3;
export type M3 = [V3, V3, V3];

export type ColorSpaceDef<T> = { r: T, g: T, b: T, w: T };

export class WhitePoint {
	static D65: V2 = [0.3127, 0.3290];
}

export class RGBColorSpace {
	static map = <T1 extends V, T2 extends V>({r, g, b, w}: ColorSpaceDef<T1>, map: (v: T1) => T2) => ({
		r: map(r),
		g: map(g),
		b: map(b),
		w: map(w)
	});

	def_xyz: ColorSpaceDef<V3>;
	xyz_matrix: math.Matrix;
	M: math.Matrix;
	invM: math.Matrix;

	constructor(private def_xy: ColorSpaceDef<V2>) {
		this.def_xyz = RGBColorSpace.map(def_xy, xy.xyz);
		this.xyz_matrix = math.transpose([this.def_xyz.r, this.def_xyz.g, this.def_xyz.b]) as math.Matrix;
		const sum = math.multiply(math.inv(this.xyz_matrix), xyz.XYZ(this.def_xyz.w)) as math.Matrix;
		const sum_diag = math.diag(sum);
		this.M = math.multiply(this.xyz_matrix, sum_diag);
		this.invM = math.inv(this.M) as math.Matrix;
	}

	XYZ(v: V3) {
		return math.multiply(this.M, v) as any as V3;
	}

	fromXYZ(v: V3) {
		return math.multiply(this.invM, v) as any as V3;
	}
}

export class xy {
	static xyz = ([x, y]: V2) => [x, y, 1 - x - y] as V3;
}

export class xyz {
	static XYZ = ([x, y, z]: V3) => [x / y, 1, z / y] as V3;
}

export class sRGB {
	static lrgb = (s: number) => s < 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
	static lRGB = ([r, g, b]: V3) => [sRGB.lrgb(r / 255), sRGB.lrgb(g / 255), sRGB.lrgb(b / 255)] as V3;
	static srgb = (l: number) => l < 0.0031308 ? 12.92 * l : 1.055 * Math.pow(l, 1 / 2.4) - 0.055;
	static sRGB = ([lr, lg, lb]: V3) => [sRGB.srgb(lr) * 255, sRGB.srgb(lg) * 255, sRGB.srgb(lb) * 255] as V3;
	static def_xy: ColorSpaceDef<V2> = {
		r: [0.64, 0.33],
		g: [0.3, 0.6],
		b: [0.15, 0.06],
		w: WhitePoint.D65
	};
	static colorSpace = new RGBColorSpace(sRGB.def_xy);

	static XYZ(rgb: V3) {
		return sRGB.colorSpace.XYZ(sRGB.lRGB(rgb));
	}

	static fromXYZ(xyz: V3) {
		return sRGB.sRGB(sRGB.colorSpace.fromXYZ(xyz));
	}

	static Lab(rgb: V3) {
		return Lab.fromXYZ(sRGB.XYZ(rgb));
	}

	static fromLab(lab: V3) {
		return sRGB.fromXYZ(Lab.XYZ(lab));
	}

	static LCh(rgb: V3) {
		return LCh.fromLab(sRGB.Lab(rgb));
	}

	static fromLCh(lch: V3) {
		return sRGB.fromLab(LCh.toLab(lch));
	}

	static RALDesign(rgb: V3) {
		return RALDesign.fromLCh(sRGB.LCh(rgb));
	}

	static fromRALDesign(ral: V3) {
		return sRGB.fromLCh(RALDesign.toLCh(ral));
	}
}

export class Lab {
	static e = 216 / 24389;
	static k = 24389 / 27;
	static f = (c: number) => c > Lab.e ? Math.pow(c, 1 / 3) : (Lab.k * c + 16) / 116;
	static if = (c: number) => c * c * c > Lab.e ? c * c * c : (116 * c - 16) / Lab.k;
	static W = xyz.XYZ(xy.xyz(WhitePoint.D65));

	static fromXYZ(xyz: V3): V3 {
		const R = math.dotDivide(xyz, Lab.W) as V3;
		const [fx, fy, fz] = math.map(R, Lab.f) as V3;
		return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
	}

	static XYZ(lab: V3): V3 {
		const [L, a, b] = lab;
		const fy = (L + 16) / 116;
		const fz = fy - b / 200;
		const fx = a / 500 + fy;
		const R = math.map([fx, fy, fz], Lab.if) as V3;
		return math.dotMultiply(R, Lab.W) as V3;
	}
}

export class LCh {
	static toLab = ([L, C, h]: V3) => LCh.toLabRad([L, C, h / 180 * Math.PI]);
	static toLabRad = ([L, C, H]: V3) => [L, C * Math.cos(H), C * Math.sin(H)] as V3;
	static fromLab = ([L, a, b]: V3) => [L, Math.sqrt(a * a + b * b), Math.atan2(b, a) / Math.PI * 180] as V3;
}

export class RALDesign {
	static toLCh = ([h, L, C]: V3) => [L, C, h] as V3;
	static fromLCh = ([L, C, h]: V3) => [h, L, C] as V3;
	static D2 = {
		"0": {
			"15": [0], "20": [0], "25": [0], "30": [0], "35": [0], "40": [0], "45": [0], "50": [0],
			"55": [0], "60": [0], "65": [0], "70": [0], "75": [0], "80": [0], "85": [0], "90": [0]
		},
		"10": {
			"20": [15, 20, 25], "30": [15, 20, 25, 30, 35, 40, 44], "40": [10, 15, 20, 25, 30, 35, 40, 45, 50, 53],
			"50": [10, 15, 20, 25, 30, 35, 40, 45, 50], "60": [10, 15, 20, 25, 30, 35, 40, 45],
			"70": [10, 15, 20, 25, 30, 35], "80": [10, 15, 20], "90": [5, 10], "92": [5]
		},
		"20": {
			"20": [5, 10, 20, 29], "30": [5, 10, 20, 30, 40, 48], "40": [5, 10, 20, 30, 40, 50],
			"50": [5, 10, 20, 30, 40, 50, 58], "60": [5, 10, 20, 30, 40], "70": [5, 10, 20, 30],
			"80": [5, 10, 20], "90": [5, 10]
		},
		"30": {
			"30": [20, 30, 40, 45], "40": [10, 20, 30, 40, 50, 60], "50": [10, 20, 30, 40, 50, 60],
			"60": [10, 20, 30, 40, 50], "70": [10, 20, 30, 40], "80": [10, 20], "90": [5, 10]
		},
		"40": {
			"20": [19], "30": [5, 10, 20, 30, 40], "40": [5, 10, 20, 30, 40, 50, 60, 67],
			"50": [5, 10, 20, 30, 40, 50, 60, 70], "60": [5, 10, 20, 30, 40, 50, 60],
			"70": [5, 10, 20, 30, 40, 50], "80": [5, 10, 20, 30], "90": [5, 10]
		},
		"50": {
			"20": [10, 16], "30": [20, 30, 36], "40": [10, 20, 30, 40, 50], "50": [10, 20, 30, 40, 50, 60, 70, 78],
			"60": [10, 20, 30, 40, 50, 60, 70, 80], "70": [10, 20, 30, 40, 50, 60], "80": [10, 20, 30], "90": [5, 10],
			"92": [5]
		},
		"60": {
			"20": [5], "30": [5, 10, 20, 27], "40": [5, 10, 20, 30, 40], "50": [5, 10, 20, 30, 40, 50, 60, 70],
			"60": [5, 10, 20, 30, 40, 50, 60, 70, 80], "70": [5, 10, 20, 30, 40, 50, 60, 70], "80": [10, 20, 30, 40],
			"90": [5, 10, 15]
		},
		"70": {
			"30": [20], "40": [10, 20, 30, 40], "50": [10, 20, 30, 40, 50, 55],
			"60": [10, 20, 30, 40, 50, 60, 70, 75], "70": [10, 20, 30, 40, 50, 60, 70, 80],
			"80": [10, 20, 30, 40, 50, 60], "90": [5, 10, 20]
		},
		"75": {
			"40": [20, 30, 38], "50": [20, 30, 40, 50, 58], "60": [10, 20, 30, 40, 50, 60, 70],
			"70": [10, 20, 30, 40, 50, 60, 70, 80], "80": [10, 20, 30, 40, 50, 60], "90": [10, 20], "92": [5]
		},
		"80": {
			"20": [10], "30": [5, 10, 20, 26], "40": [5, 10, 20, 30, 40], "50": [5, 10, 20, 30, 40, 50],
			"60": [5, 10, 20, 30, 40, 50, 60, 70], "70": [10, 20, 30, 40, 50, 60, 70, 80, 88],
			"80": [5, 10, 20, 30, 40, 50, 60, 70, 80, 90], "90": [5, 10, 20]
		},
		"85": {
			"40": [20, 30], "50": [20, 30, 40, 50], "60": [10, 20, 30, 40, 50, 60],
			"70": [10, 20, 30, 40, 50, 60, 70, 75], "80": [10, 20, 30, 40, 50, 60, 70, 80, 85],
			"90": [10, 20, 30]
		},
		"90": {
			"30": [20], "40": [10, 20, 30], "50": [10, 20, 30, 40], "60": [10, 20, 30, 40, 50, 60],
			"70": [10, 20, 30, 40, 50, 60, 70, 80], "80": [10, 20, 30, 40, 50, 60, 70, 80, 90],
			"90": [5, 10, 20, 30]
		},
		"95": {
			"40": [20, 30], "50": [20, 30, 40, 50], "60": [10, 20, 30, 40, 50, 60, 70],
			"70": [10, 20, 30, 40, 50, 60, 70], "80": [10, 20, 30, 40, 50, 60, 70, 80],
			"90": [10, 20, 30, 40, 50, 59]
		},
		"100": {
			"20": [5], "30": [5, 10, 20], "40": [5, 10, 20, 30, 40], "50": [5, 10, 20, 30, 40, 50],
			"60": [5, 10, 20, 30, 40, 50, 60], "70": [5, 10, 20, 30, 40, 50, 60],
			"80": [5, 10, 20, 30, 40, 50, 60, 70, 80], "90": [5, 10, 20, 30, 40, 50]
		},
		"110": {
			"20": [10], "30": [20], "40": [10, 20, 30, 40], "50": [10, 20, 30, 40, 50, 55],
			"60": [10, 20, 30, 40, 50, 60, 65], "70": [10, 20, 30, 40, 50, 60, 70, 77],
			"80": [10, 20, 30, 40, 50, 60, 70], "90": [5, 10, 20, 30, 35, 40], "92": [5]
		},
		"120": {
			"30": [5, 10, 20], "40": [5, 10, 20, 30, 40], "50": [5, 10, 20, 30, 40, 50],
			"60": [5, 10, 20, 30, 40, 50, 60, 63], "70": [5, 10, 20, 30, 40, 50, 60, 70, 75],
			"80": [5, 10, 20, 30, 40, 50, 60], "90": [5, 10, 20, 30]
		},
		"130": {
			"30": [20], "40": [10, 20, 30], "50": [10, 20, 30, 40, 50], "60": [10, 20, 30, 40, 50, 60],
			"70": [10, 20, 30, 40, 50, 60], "80": [10, 20, 30, 40, 50], "90": [5, 10, 20], "92": [5]
		},
		"140": {
			"20": [5, 10, 20], "30": [5, 10, 20, 30, 40], "40": [5, 10, 20, 30, 40, 50],
			"50": [5, 10, 20, 30, 40, 50, 60], "60": [5, 10, 20, 30, 40, 50, 60, 70],
			"70": [5, 10, 20, 30, 40, 50, 60], "80": [10, 20, 30, 40], "90": [5, 10]
		},
		"150": {
			"30": [20, 30], "40": [10, 20, 30, 40, 50], "50": [10, 20, 30, 40, 50, 60],
			"60": [10, 20, 30, 40, 50, 60], "70": [10, 20, 30, 40, 50], "80": [10, 20, 30, 40], "90": [5, 10]
		},
		"160": {
			"20": [15, 20], "30": [5, 10, 15, 20, 25, 30, 35, 38], "40": [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
			"50": [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
			"60": [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 58], "70": [5, 10, 15, 20, 25, 30, 35, 40, 45, 49],
			"80": [5, 10, 15, 20, 25, 30], "90": [5, 10]
		},
		"170": {
			"20": [10, 20, 25], "30": [15, 20, 25, 30, 35, 40], "40": [10, 15, 20, 25, 30, 35, 40, 45, 50],
			"50": [10, 15, 20, 25, 30, 35, 40, 45, 50, 55], "60": [10, 15, 20, 25, 30, 35, 40, 45, 50],
			"70": [10, 15, 20, 25, 30, 35, 40], "80": [10, 15, 20, 25], "90": [5, 10], "92": [5]
		},
		"180": {
			"20": [5, 15, 20], "30": [5, 10, 15, 20, 25, 30, 35], "40": [5, 10, 15, 20, 25, 30, 35, 40, 45],
			"50": [5, 10, 15, 20, 25, 30, 35, 40, 45, 50], "60": [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
			"70": [5, 10, 15, 20, 25, 30, 35, 40], "80": [5, 10, 15, 20, 25, 30], "90": [5, 10]
		},
		"190": {
			"20": [20], "30": [15, 20, 25, 30, 35], "40": [10, 15, 20, 25, 30, 35, 40, 45],
			"50": [10, 15, 20, 25, 30, 35, 40, 45], "60": [10, 15, 20, 25, 30, 35, 40, 45],
			"70": [10, 15, 20, 25, 30, 35], "80": [10, 15, 20, 25], "90": [5, 10]
		},
		"200": {
			"20": [10, 15, 20, 23], "30": [5, 10, 15, 20, 25, 30, 33], "40": [5, 10, 15, 20, 25, 30, 35, 40],
			"50": [5, 10, 15, 20, 25, 30, 35, 40, 45], "60": [5, 10, 15, 20, 25, 30, 35, 40],
			"70": [5, 10, 15, 20, 25], "80": [5, 10, 15, 20, 25], "90": [5, 10], "92": [5]
		},
		"210": {
			"30": [15, 20, 25, 30], "40": [10, 15, 20, 25, 30, 35, 38], "50": [10, 15, 20, 25, 30, 35, 40, 45],
			"60": [10, 15, 20, 25, 30, 35, 40], "70": [10, 15, 20, 25, 30, 35], "80": [10, 15, 20, 25],
			"90": [5, 10]
		}, "220": {
			"20": [5, 15, 20], "30": [5, 10, 15, 20, 25, 30], "40": [5, 10, 15, 20, 25, 30, 35, 40],
			"50": [5, 10, 15, 20, 25, 30, 35, 40], "60": [5, 10, 15, 20, 25, 30, 35, 40],
			"70": [5, 10, 15, 20, 25, 30, 35], "80": [5, 10, 15, 20, 25], "90": [5], "92": [5]
		},
		"230": {
			"20": [10, 20], "30": [15, 20, 25], "40": [10, 15, 20, 25, 30, 35, 40], "50": [10, 15, 20, 25, 30, 35, 40],
			"60": [10, 15, 20, 25, 30, 35, 40], "70": [10, 15, 20, 25, 30], "80": [10, 15, 20], "90": [5]
		},
		"240": {
			"20": [15, 20, 22], "30": [5, 10, 15, 20, 25, 30, 35], "40": [5, 10, 15, 20, 25, 30, 35, 40],
			"50": [5, 10, 15, 20, 25, 30, 35, 40], "60": [5, 10, 15, 20, 25, 30, 35, 40],
			"70": [5, 10, 15, 20, 25, 30], "80": [5, 10, 15, 20], "90": [5]
		},
		"250": {
			"20": [20, 25], "30": [15, 20, 25, 30], "40": [10, 15, 20, 25, 30, 35, 40],
			"50": [10, 15, 20, 25, 30, 35, 40], "60": [10, 15, 20, 25, 30, 35, 40], "70": [10, 15, 20, 25, 30],
			"80": [10, 15, 20], "90": [5], "92": [5]
		},
		"260": {
			"20": [5, 10, 15, 20], "30": [5, 10, 15, 20, 25, 30, 35], "40": [5, 10, 15, 20, 25, 30, 35, 40, 45],
			"50": [5, 10, 15, 20, 25, 30, 35, 40], "60": [5, 10, 15, 20, 25, 30, 35], "70": [5, 10, 15, 20, 25],
			"80": [5, 10, 15], "90": [5]
		},
		"270": {
			"20": [20, 25, 29], "30": [15, 20, 25, 30, 35, 40], "40": [15, 20, 25, 30, 35, 40],
			"50": [10, 15, 20, 25, 30, 35, 40], "60": [10, 15, 20, 25, 30, 35], "70": [10, 15, 20, 25],
			"80": [10, 15], "90": [5]
		},
		"280": {
			"20": [15, 20, 25, 30], "30": [5, 10, 15, 20, 25, 30, 35, 40], "40": [5, 10, 15, 20, 25, 30, 35, 40, 45],
			"50": [5, 10, 15, 20, 25, 30, 35, 40], "60": [5, 10, 15, 20, 25, 30, 35], "70": [5, 10, 15, 20, 25],
			"80": [5, 10, 15], "90": [5]
		},
		"290": {
			"20": [10, 20, 25, 30, 35], "30": [15, 20, 25, 30, 35, 40], "40": [10, 15, 20, 25, 30, 35, 40, 45],
			"50": [10, 15, 20, 25, 30, 35, 40], "60": [10, 15, 20, 25, 30, 35], "70": [10, 15, 20, 25],
			"80": [10, 15], "90": [5], "92": [5]
		},
		"300": {
			"20": [5, 15, 20, 25, 30], "30": [5, 10, 15, 20, 25, 30, 35, 40], "40": [5, 10, 15, 20, 25, 30, 35, 40, 45],
			"50": [5, 10, 15, 20, 25, 30, 35, 40], "60": [5, 10, 15, 20, 25, 30, 35], "70": [5, 10, 15, 20, 25],
			"80": [5, 10, 15], "90": [5]
		},
		"310": {
			"20": [20, 25, 30], "30": [15, 20, 25, 30, 35, 40], "40": [10, 15, 20, 25, 30, 35, 40],
			"50": [10, 15, 20, 25, 30, 35, 40], "60": [10, 15, 20, 25, 30, 35], "70": [10, 15, 20, 25],
			"80": [10, 15], "90": [5]
		},
		"320": {
			"20": [10, 15, 20, 25], "30": [5, 10, 15, 20, 25, 30, 35, 37], "40": [5, 10, 15, 20, 25, 30, 35, 40],
			"50": [5, 10, 15, 20, 25, 30, 35, 39], "60": [5, 10, 15, 20, 25, 30, 35], "70": [5, 10, 15, 20, 25],
			"80": [5, 10, 15], "90": [5]
		},
		"330": {
			"20": [20, 25], "30": [15, 20, 25, 30, 35, 40], "40": [10, 15, 20, 25, 30, 35, 40, 45],
			"50": [10, 15, 20, 25, 30, 35, 40], "60": [10, 15, 20, 25, 30, 35, 40], "70": [10, 15, 20, 25, 30],
			"80": [10, 15, 20], "90": [5]
		},
		"340": {
			"20": [5, 15, 20, 25], "30": [5, 10, 15, 20, 25, 30, 35, 40], "40": [5, 10, 15, 20, 25, 30, 35, 40, 45],
			"50": [5, 10, 15, 20, 25, 30, 35, 40, 45], "60": [5, 10, 15, 20, 25, 30, 35, 40],
			"70": [5, 10, 15, 20, 25, 30, 35], "80": [5, 10, 15, 20], "90": [5], "92": [5]
		},
		"350": {
			"20": [10, 20, 25, 30], "30": [15, 20, 25, 30, 35, 40],
			"40": [10, 15, 20, 25, 30, 35, 40, 45, 50], "50": [10, 15, 20, 25, 30, 35, 40, 45, 50],
			"60": [10, 15, 20, 25, 30, 35, 40, 45], "70": [10, 15, 20, 25, 30, 35], "80": [10, 15, 20], "90": [5]
		},
		"360": {
			"20": [15], "30": [5, 10, 15, 20, 25, 30, 35, 40], "40": [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
			"50": [5, 10, 15, 20, 25, 30, 35, 40, 45, 50], "60": [5, 10, 15, 20, 25], "70": [5, 10, 15], "80": [5, 10],
			"90": [5], "92": [5]
		}
	};
}

export const Colors = {
	Red: [255, 0, 0] as V3,
	Yellow: [255, 255, 0] as V3,
	Green: [0, 255, 0] as V3,
	Blue: [0, 0, 255] as V3,
};


console.log(sRGB.RALDesign(Colors.Red));
