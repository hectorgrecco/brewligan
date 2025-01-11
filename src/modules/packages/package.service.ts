import { Injectable } from "@nestjs/common";
import { spawn } from "node:child_process";
import * as dayjs from "dayjs";

@Injectable()
export class PackageService {
    constructor() { }

    async findAll(): Promise<Record<string, any>[]> {
        try {
            const packages = await this.getUserInstalledPackages();

            const packageDetails = await Promise.all(
                packages.map(async (pkg) => {
                    const details = await this.getPackageInfo(pkg);
                    return details;
                })
            );

            return packageDetails;
        } catch (error) {
            throw new Error(`Failed to retrieve packages: ${error.message}`);
        }
    }

    private getUserInstalledPackages(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const leaves = spawn("brew", ["leaves"]);

            let output = '';
            let errorOutput = '';

            leaves.stdout.on("data", (data) => {
                output += data.toString();
            });

            leaves.stderr.on("data", (data) => {
                errorOutput += data.toString();
            });

            leaves.on("close", (code) => {
                if (code === 0) {
                    resolve(output.trim().split("\n"));
                } else {
                    reject(new Error(`Command failed with exit code ${code}: ${errorOutput}`));
                }
            });

            leaves.on("error", (error) => {
                reject(error); // Handles process spawn errors
            });
        });
    }

    private getPackageInfo(packageName: string): Promise<Record<string, any>> {
        return new Promise((resolve, reject) => {
            const info = spawn("brew", ["info", "--json=v2", packageName]);

            let output = '';
            let errorOutput = '';

            info.stdout.on("data", (data) => {
                output += data.toString();
            });

            info.stderr.on("data", (data) => {
                errorOutput += data.toString();
            });

            info.on("close", (code) => {
                if (code === 0) {
                    try {
                        const parsedInfo = JSON.parse(output).formulae[0];
                        const packageData = {
                            name: parsedInfo?.name,
                            description: parsedInfo?.desc,
                            url: parsedInfo?.homepage,
                            deprecated: parsedInfo?.deprecated || false,
                            installedDate: parsedInfo?.installed[0]?.time ? dayjs(parsedInfo.installed[0].time * 1000).format('YYYY-MM-DD HH:mm:ss') : null, // Unix timestamp
                        };
                        resolve(packageData);
                    } catch (error) {
                        reject(new Error(`Error parsing JSON for package ${packageName}: ${error.message}`));
                    }
                } else {
                    reject(new Error(`Command failed with exit code ${code}: ${errorOutput}`));
                }
            });

            info.on("error", (error) => {
                reject(error); // Handles process spawn errors
            });
        });
    }

    async removePackage(packageName: string): Promise<void> {
        try {
            const packages = await this.getUserInstalledPackages();

            if (!packages.includes(packageName)) {
                throw new Error(`Package '${packageName}' is not installed.`);
            }

            await new Promise((resolve, reject) => {
                const uninstall = spawn("brew", ["uninstall", packageName]);

                let errorOutput = '';

                uninstall.stderr.on("data", (data) => {
                    errorOutput += data.toString();
                });

                uninstall.on("close", (code) => {
                    if (code === 0) {
                        resolve(null);
                    } else {
                        reject(new Error(`Command failed with exit code ${code}: ${errorOutput}`));
                    }
                });

                uninstall.on("error", (error) => {
                    reject(error); // Handles process spawn errors
                });
            });

            console.log(`Package '${packageName}' has been successfully removed.`);
        } catch (error) {
            throw new Error(`Failed to remove package '${packageName}': ${error.message}`);
        }
    }
}
