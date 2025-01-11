import { Controller, Delete, Get, Param } from "@nestjs/common";
import { PackageService } from "./package.service";

@Controller('packages')
export class PackageController {
    constructor(private readonly packageService: PackageService) { }

    @Get()
    findAll() {
        return this.packageService.findAll();
    }

    @Delete(':name')
    remove(@Param('name') name: string) {
        return this.packageService.removePackage(name);
    }
}